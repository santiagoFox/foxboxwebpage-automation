#!/usr/bin/env node
/**
 * Indexing monitor — external guard for FOX2-154.
 *
 * Context: PR #184 made production serve `Disallow: /` from 2026-06-19 to
 * 2026-07-28. foxbox.com was fully deindexed for ~5.5 weeks and nothing noticed.
 * This script is the outside-the-deploy-pipeline check that would have caught it
 * within the hour.
 *
 * Deliberately dependency-free and browser-free: it uses only `fetch` from the
 * Node runtime so it can run anywhere (GH Actions cron, a laptop, a cron box)
 * without `npm ci` or a Playwright install. Keep it that way — the value of this
 * check is that it keeps working when the rest of the repo's tooling does not.
 *
 * ASSERTS EXPECTED STATE, does not diff. A diff-based monitor alerts on every
 * benign `Disallow: /some-new-path` addition and gets muted within a month. The
 * failure mode we care about is narrow and known, so it is asserted directly.
 *
 * TWO INDEPENDENT MECHANISMS, because they catch different things (FOX2-156):
 *
 *   1. Assertions (default mode) — "is production in a known-good state?" Gating
 *      failures page the on-call. Narrow, opinionated, near-zero false positives.
 *
 *   2. Snapshot + diff (`--snapshot`) — "did anything change since last hour?"
 *      Reports before/after for ANY change to robots.txt or the X-Robots-Tag
 *      header, including changes no assertion anticipates. Non-paging by design:
 *      a scoped `Disallow: /new-path` is a legitimate edit, and paging on it is
 *      how a monitor earns a mute. The diff is the audit trail the June incident
 *      lacked — nobody could say when robots.txt changed or what it said before.
 *
 * Neither replaces the other. Assertions catch the known-catastrophic; the diff
 * catches the unanticipated.
 *
 * Usage:
 *   node scripts/check-indexing.mjs              # assert all sites
 *   node scripts/check-indexing.mjs foxbox       # one site by key
 *   node scripts/check-indexing.mjs --json       # machine-readable assertions
 *   node scripts/check-indexing.mjs --snapshot   # emit indexing-state JSON to stdout
 *   node scripts/check-indexing.mjs --force-failure   # inject a synthetic gating
 *                                                     # failure to exercise alerting
 *
 * Exit codes: 0 = all gating checks passed, 1 = at least one gating FAIL,
 * 2 = script error.
 */

// Canonical host per site, verified 2026-08-03. These do NOT agree — foxbox and
// signallabs canonicalise to www, stormwind canonicalises to the apex. Asserting
// the wrong direction produces a permanently red monitor, so each site declares
// its own expectation rather than sharing a convention.
const SITES = [
  {
    key: 'foxbox',
    label: 'foxbox.com',
    origin: 'https://www.foxbox.com',
    // apex 308 -> www
    redirectFrom: 'https://foxbox.com',
    canonicalSamplePaths: ['/', '/blog', '/services/product-lab'],

    // WARNING(FOX2-155): that ticket is "Fix www redirect direction — foxbox.com
    // should be primary", i.e. the intended fix FLIPS this to www 301 -> apex.
    // When it lands, swap these two values or the redirect-direction check pages a
    // false alarm on a correctly-configured site — and a monitor that cries wolf on
    // day one is the failure mode this whole file exists to prevent.
    //   origin:       'https://foxbox.com'
    //   redirectFrom: 'https://www.foxbox.com'
    // The canonical checks need no change: tags already point at the apex, which is
    // exactly why they start passing once the apex becomes primary.
  },
  {
    key: 'stormwind',
    label: 'stormwindstudios.com',
    origin: 'https://stormwindstudios.com',
    // www 301 -> apex
    redirectFrom: 'https://www.stormwindstudios.com',
  },
  {
    key: 'signallabs',
    label: 'signallabs.ai',
    origin: 'https://www.signallabs.ai',
    redirectFrom: null, // apex -> www hop not asserted; see NOTE in checkSite
  },
];

// Non-public hosts, asserted INVERTED: these must block crawlers. Catches a
// deny-list that stops matching `staging.*` and quietly makes staging indexable.
const BLOCKED_HOSTS = [
  { key: 'foxbox-staging', label: 'staging.foxbox.com', origin: 'https://staging.foxbox.com' },
];

// A bare `Disallow: /` — the FOX2-154 failure. Must not match `Disallow: /studio`
// or any other scoped rule, so the line has to end right after the slash.
const BLANKET_DISALLOW = /^\s*Disallow:\s*\/\s*$/im;
const ALLOW_ROOT = /^\s*Allow:\s*\/\s*$/im;
const SITEMAP_LINE = /^\s*Sitemap:\s*(\S+)/im;

const TIMEOUT_MS = 20_000;

/**
 * Two tiers of failure:
 *   'gate' — fails the job and pages the channel. Reserved for the deindexing class.
 *   'warn' — reported and archived, but does not page anyone.
 *
 * The tiers exist because of FOX2-155. The canonical checks below fail on
 * production RIGHT NOW (261 pages), so shipping them as gating would make the
 * monitor red on its first run — and a monitor that is red on arrival gets muted,
 * which is the exact failure this whole exercise is meant to prevent. They run as
 * warnings until FOX2-155 lands.
 *
 * TODO(FOX2-155): promote CANONICAL_TIER to 'gate' once canonical tags point at the
 * canonical serving host. At that point a regression here should page.
 */
const CANONICAL_TIER = 'warn';

async function req(url, { redirect = 'follow' } = {}) {
  const res = await fetch(url, {
    redirect,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      // Identify the monitor in access logs so it is not mistaken for a scraper.
      'user-agent': 'foxbox-indexing-monitor (+https://github.com/santiagoFox/playwright_foxboxweb_project)',
    },
  });
  return res;
}

const CANONICAL_TAG = /<link[^>]+rel=["']?canonical["']?[^>]*>/i;
const HREF_ATTR = /href=["']([^"']+)["']/i;

/**
 * Asserts that a page's rel=canonical points at the canonical serving host and
 * does not point at a redirect.
 *
 * This is the FOX2-155 class: a page can return 200, have a clean robots.txt and no
 * noindex header, and still be non-indexable because its canonical tag points
 * somewhere that redirects. Verified 2026-07-31 via Ahrefs Site Audit — 261 foxbox
 * pages canonicalise to the apex, which 308s back to www.
 */
async function checkCanonical(site, path, add) {
  let html;
  try {
    const res = await req(`${site.origin}${path}`);
    html = await res.text();
  } catch (err) {
    add(`canonical on ${path}`, false, `request failed: ${err.message}`, CANONICAL_TIER);
    return;
  }

  const tag = html.match(CANONICAL_TAG);
  if (!tag) {
    add(`canonical on ${path}`, false, 'no <link rel="canonical"> found', CANONICAL_TIER);
    return;
  }

  const href = tag[0].match(HREF_ATTR)?.[1];
  if (!href) {
    add(`canonical on ${path}`, false, `canonical tag has no href: ${tag[0]}`, CANONICAL_TIER);
    return;
  }

  let canonical;
  try {
    canonical = new URL(href, `${site.origin}${path}`);
  } catch {
    add(`canonical on ${path}`, false, `canonical href is not a valid URL: ${href}`, CANONICAL_TIER);
    return;
  }

  const expectedHost = new URL(site.origin).host;
  add(
    `canonical on ${path} uses the canonical host`,
    canonical.host === expectedHost,
    canonical.host === expectedHost
      ? `-> ${canonical.href}`
      : `points at ${canonical.host}, expected ${expectedHost} (${canonical.href})`,
    CANONICAL_TIER
  );

  // The sharper assertion: even a same-host canonical is broken if the target
  // redirects. Checked independently of the host comparison.
  try {
    const res = await req(canonical.href, { redirect: 'manual' });
    const redirects = res.status >= 300 && res.status < 400;
    add(
      `canonical on ${path} does not point at a redirect`,
      !redirects,
      redirects
        ? `canonical target returns HTTP ${res.status} -> ${res.headers.get('location') ?? '?'} — ` +
          `Google treats this page as non-indexable (FOX2-155)`
        : `canonical target returns HTTP ${res.status}`,
      CANONICAL_TIER
    );
  } catch (err) {
    add(`canonical on ${path} does not point at a redirect`, false, `request failed: ${err.message}`, CANONICAL_TIER);
  }
}

/** Collects results for one public site. Each entry: {name, ok, detail, tier}. */
async function checkSite(site) {
  const checks = [];
  const add = (name, ok, detail, tier = 'gate') => checks.push({ name, ok, detail, tier });

  // --- robots.txt ---------------------------------------------------------
  let body = '';
  try {
    const res = await req(`${site.origin}/robots.txt`);
    const okStatus = res.status === 200;
    body = await res.text();
    add('robots.txt serves 200', okStatus, `HTTP ${res.status}`);
    add('robots.txt is non-empty', body.trim() !== '', `${body.length} bytes`);
  } catch (err) {
    add('robots.txt serves 200', false, `request failed: ${err.message}`);
    return checks; // nothing else about robots.txt is meaningful
  }

  // THE check. Everything else in this file is secondary to this line.
  const blanket = BLANKET_DISALLOW.test(body);
  add(
    'robots.txt has NO blanket "Disallow: /"',
    !blanket,
    blanket
      ? `DEINDEXING THE ENTIRE SITE. robots.txt:\n${indent(body)}`
      : 'no blanket disallow'
  );

  add(
    'robots.txt allows the root',
    ALLOW_ROOT.test(body),
    ALLOW_ROOT.test(body) ? 'Allow: / present' : `no "Allow: /" directive:\n${indent(body)}`
  );

  // --- sitemap ------------------------------------------------------------
  const sitemapMatch = body.match(SITEMAP_LINE);
  add('robots.txt declares a Sitemap', Boolean(sitemapMatch), sitemapMatch ? sitemapMatch[1] : 'no Sitemap: line');

  if (sitemapMatch) {
    const sitemapUrl = sitemapMatch[1];
    try {
      // Followed on purpose: foxbox and signallabs both declare the apex host and
      // hop once to www. The hop is acceptable; only the destination matters.
      const res = await req(sitemapUrl);
      const xml = await res.text();
      const isXml = /<(urlset|sitemapindex)\b/i.test(xml);
      add(
        'declared sitemap resolves to XML',
        res.status === 200 && isXml,
        `HTTP ${res.status}${isXml ? '' : ' — response is not sitemap XML'} (${sitemapUrl})`
      );
    } catch (err) {
      add('declared sitemap resolves to XML', false, `request failed: ${err.message}`);
    }
  }

  // --- X-Robots-Tag header ------------------------------------------------
  // Second half of the FOX2-154 fix. This one is baked into the build artifact by
  // next.config.js `headers()`, so a correct robots.txt does not clear the site.
  try {
    const res = await req(`${site.origin}/`);
    const header = res.headers.get('x-robots-tag') ?? '';
    const noindex = /noindex/i.test(header);
    add(
      'no "X-Robots-Tag: noindex" on /',
      !noindex,
      noindex ? `sent "X-Robots-Tag: ${header}" — deindexes the page regardless of robots.txt` : 'header absent or indexable'
    );
  } catch (err) {
    add('no "X-Robots-Tag: noindex" on /', false, `request failed: ${err.message}`);
  }

  // --- canonical host redirect (FOX2-155 class) ---------------------------
  // NOTE: only asserted where the non-canonical host is known to redirect. This
  // catches a canonicalisation break at the platform level, which no in-repo test
  // can see. It does NOT diagnose Search Console "Not Indexable" reports — those
  // can stem from page-level canonical tags that are invisible to a HEAD request.
  if (site.redirectFrom) {
    try {
      const res = await req(`${site.redirectFrom}/`, { redirect: 'manual' });
      const location = res.headers.get('location') ?? '';
      const is3xx = res.status >= 300 && res.status < 400;
      const landsCanonical = location.replace(/\/+$/, '') === site.origin;
      add(
        `${hostOf(site.redirectFrom)} redirects to canonical host`,
        is3xx && landsCanonical,
        `HTTP ${res.status} -> ${location || '(no Location header)'}`
      );
    } catch (err) {
      add(`${hostOf(site.redirectFrom)} redirects to canonical host`, false, `request failed: ${err.message}`);
    }
  }

  // --- rel=canonical (FOX2-155 class) -------------------------------------
  // Sampled, not exhaustive: the root plus a couple of representative templates.
  // The failure is generated from one shared base-URL constant, so it is uniform
  // across the site — sampling three pages detects it as reliably as crawling 261,
  // at a fraction of the runtime. Ahrefs remains the tool for full-site coverage.
  for (const path of site.canonicalSamplePaths ?? ['/']) {
    await checkCanonical(site, path, add);
  }

  return checks;
}

/** Inverted checks for a host that must NOT be indexable. */
async function checkBlockedHost(host) {
  const checks = [];
  const add = (name, ok, detail, tier = 'gate') => checks.push({ name, ok, detail, tier });

  try {
    const res = await req(`${host.origin}/robots.txt`);
    const body = await res.text();
    const blocked = BLANKET_DISALLOW.test(body);
    add(
      'robots.txt DOES block crawlers',
      blocked,
      blocked ? 'Disallow: / present' : `NOT blocking — this host is indexable:\n${indent(body)}`
    );
  } catch (err) {
    add('robots.txt DOES block crawlers', false, `request failed: ${err.message}`);
  }

  try {
    const res = await req(`${host.origin}/`);
    const header = res.headers.get('x-robots-tag') ?? '';
    add(
      'sends "X-Robots-Tag: noindex"',
      /noindex/i.test(header),
      header ? `"${header}"` : 'no X-Robots-Tag header — deny-list is not matching this host'
    );
  } catch (err) {
    add('sends "X-Robots-Tag: noindex"', false, `request failed: ${err.message}`);
  }

  return checks;
}

const hostOf = (url) => new URL(url).host;
const indent = (text) => text.trim().split('\n').map((l) => `      ${l}`).join('\n');

/**
 * Every origin whose indexing state is snapshotted. Deliberately broader than the
 * assertion set: FOX2-156 names `https://foxbox.com/robots.txt` specifically, and
 * the apex is a distinct origin from www even while it 308s across. Once FOX2-155
 * makes the apex primary, this is the origin that matters most.
 */
const SNAPSHOT_ORIGINS = [
  { key: 'foxbox-www', origin: 'https://www.foxbox.com', canonicalOf: '/' },
  { key: 'foxbox-apex', origin: 'https://foxbox.com', canonicalOf: '/' },
  { key: 'stormwind', origin: 'https://stormwindstudios.com', canonicalOf: '/' },
  { key: 'signallabs', origin: 'https://www.signallabs.ai', canonicalOf: '/' },
  { key: 'foxbox-staging', origin: 'https://staging.foxbox.com', canonicalOf: null },
];

/**
 * Emits the current indexing-control state as stable JSON, for commit-and-diff.
 *
 * Determinism matters more than completeness here: anything that varies per request
 * (timestamps, request IDs, ETags) would produce a diff every hour and train
 * everyone to ignore the alert. Only fields that change when someone changes
 * something are recorded. No timestamp is included for exactly this reason — git
 * already records when the snapshot moved.
 */
async function buildSnapshot() {
  const snapshot = {};

  for (const { key, origin, canonicalOf } of SNAPSHOT_ORIGINS) {
    const entry = { origin };

    try {
      const res = await req(`${origin}/robots.txt`, { redirect: 'manual' });
      entry.robotsStatus = res.status;
      if (res.status >= 300 && res.status < 400) {
        // Record the hop rather than its destination: a redirect appearing or
        // disappearing on /robots.txt is itself a change worth seeing.
        entry.robotsRedirectsTo = res.headers.get('location') ?? null;
        const followed = await req(`${origin}/robots.txt`);
        entry.robotsBody = normaliseBody(await followed.text());
      } else {
        entry.robotsBody = normaliseBody(await res.text());
      }
    } catch (err) {
      entry.robotsError = err.message;
    }

    try {
      const res = await req(`${origin}/`, { redirect: 'manual' });
      entry.rootStatus = res.status;
      entry.xRobotsTag = res.headers.get('x-robots-tag') ?? null;
      const location = res.headers.get('location');
      if (location) entry.rootRedirectsTo = location;
    } catch (err) {
      entry.rootError = err.message;
    }

    if (canonicalOf) {
      try {
        const res = await req(`${origin}${canonicalOf}`);
        const tag = (await res.text()).match(CANONICAL_TAG);
        entry.canonical = tag ? (tag[0].match(HREF_ATTR)?.[1] ?? null) : null;
      } catch (err) {
        entry.canonicalError = err.message;
      }
    }

    snapshot[key] = entry;
  }

  return snapshot;
}

// CRLF and trailing whitespace vary between edge nodes and would diff spuriously.
const normaliseBody = (text) => text.replace(/\r\n/g, '\n').trim();

async function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');
  const keys = args.filter((a) => !a.startsWith('--'));

  if (args.includes('--snapshot')) {
    // Trailing newline so the committed file is POSIX-clean and diffs read well.
    process.stdout.write(JSON.stringify(await buildSnapshot(), null, 2) + '\n');
    process.exit(0);
  }

  const publicSites = keys.length ? SITES.filter((s) => keys.includes(s.key)) : SITES;
  const blockedHosts = keys.length ? BLOCKED_HOSTS.filter((h) => keys.includes(h.key)) : BLOCKED_HOSTS;

  if (!publicSites.length && !blockedHosts.length) {
    console.error(`No site matched ${JSON.stringify(keys)}.`);
    console.error(`Known keys: ${[...SITES, ...BLOCKED_HOSTS].map((s) => s.key).join(', ')}`);
    process.exit(2);
  }

  const results = [];
  for (const site of publicSites) {
    results.push({ label: site.label, kind: 'public', checks: await checkSite(site) });
  }
  for (const host of blockedHosts) {
    results.push({ label: host.label, kind: 'blocked', checks: await checkBlockedHost(host) });
  }

  // FOX2-156 acceptance criterion: "Confirm the alert fires by deliberately
  // triggering it once." A test message proves delivery but not that a real failure
  // reaches the channel, so this exercises the genuine gating path end to end.
  if (args.includes('--force-failure')) {
    results.push({
      label: 'SYNTHETIC (--force-failure)',
      kind: 'public',
      checks: [
        {
          name: 'deliberate failure to exercise the alert path',
          ok: false,
          tier: 'gate',
          detail:
            'This is a drill, not an incident. Triggered by --force-failure to satisfy ' +
            'FOX2-156 ("confirm the alert fires by deliberately triggering it once"). ' +
            'Production was NOT asserted to be broken by this check.',
        },
      ],
    });
  }

  const bad = results.flatMap((r) => r.checks.filter((c) => !c.ok).map((c) => ({ ...c, label: r.label })));
  const gating = bad.filter((c) => c.tier === 'gate');
  const warnings = bad.filter((c) => c.tier !== 'gate');

  if (asJson) {
    console.log(JSON.stringify({ ok: gating.length === 0, gating: gating.length, warnings: warnings.length, results }, null, 2));
  } else {
    for (const r of results) {
      const g = r.checks.filter((c) => !c.ok && c.tier === 'gate').length;
      const w = r.checks.filter((c) => !c.ok && c.tier !== 'gate').length;
      const verdict = g ? 'FAIL' : w ? 'WARN' : 'PASS';
      console.log(`\n${verdict}  ${r.label}${r.kind === 'blocked' ? '  (must be blocked)' : ''}`);
      for (const c of r.checks) {
        const mark = c.ok ? '  ok' : c.tier === 'gate' ? 'FAIL' : 'WARN';
        console.log(`  ${mark}  ${c.name}`);
        if (!c.ok || process.env.VERBOSE) console.log(`        ${c.detail}`);
      }
    }

    if (gating.length) {
      console.log(`\n${gating.length} GATING check(s) failed across ${new Set(gating.map((f) => f.label)).size} host(s).`);
    } else {
      console.log(`\nAll gating checks passed across ${results.length} host(s).`);
    }
    if (warnings.length) {
      console.log(
        `${warnings.length} warning(s) — known issues, not paging anyone. ` +
          `See TODO(FOX2-155) in this script.`
      );
    }
  }

  // Warnings deliberately do not affect the exit code; see CANONICAL_TIER.
  process.exit(gating.length ? 1 : 0);
}

main().catch((err) => {
  console.error(`indexing monitor crashed: ${err.stack ?? err.message}`);
  process.exit(2);
});
