# Runbook: indexing monitor alert

What to do when `indexing-monitor` posts to Slack. Written for whoever is on call, not
for whoever built it — no prior context assumed.

**Why this exists:** in June 2026, PR #184 made production serve `Disallow: /`.
foxbox.com was fully deindexed for about 5.5 weeks. The site was up the whole time and
looked fine. The first signal was a Google Search Console email that took roughly a
month to arrive. Recovery from deindexing is slow and partial, so minutes matter here in
a way they don't for most alerts.

---

## Which alert did you get?

| Slack message | Severity | Meaning |
|---|---|---|
| 🚨 **Indexing check FAILED** (pings on-call) | Act now | Production is asserted to be in a known-bad state |
| **Indexing state changed** (no ping) | Investigate | robots.txt or `X-Robots-Tag` changed. Might be intentional |
| ✅ **test alert** | None | Someone verified the webhook. Ignore |

If the alert says "This is a drill" in the body, someone ran the workflow with
`force_failure` to satisfy the FOX2-156 acceptance criterion. Nothing is wrong. Confirm
in the channel so nobody else starts triaging.

---

## 🚨 Indexing check FAILED

### 1. Confirm it from your own machine (30 seconds)

Don't trust a single source, including this monitor.

```bash
curl -sS https://www.foxbox.com/robots.txt
curl -sSI https://www.foxbox.com/ | grep -i x-robots-tag
```

- **`Disallow: /` in robots.txt** → confirmed, continue
- **`x-robots-tag: noindex`** → confirmed, continue. This one is worse: it is baked into
  the build artifact by `headers()` in `next.config.js`, so fixing robots.txt alone will
  not clear it
- **Both look fine** → the alert is stale or the monitor is wrong. Re-run the workflow.
  If it passes, note it in the channel and open a ticket against the monitor rather than
  muting it

### 2. Find out what shipped

The cause is almost always a deploy. Check what reached production most recently — a
promotion of staging to main is the highest-risk event, since the June incident was
exactly that.

Look specifically at:

- `src/pages/robots.txt.ts` — generates robots.txt
- `next.config.js` — the `headers()` block that sets `X-Robots-Tag`

**The known failure mode:** logic gated on `VERCEL_ENV === 'production'`. If `VERCEL_ENV`
does not resolve to `production` in the production environment, the gate falls through to
the blocked branch and the whole site asks not to be indexed. The fix (PR #245) replaced
this with a host-based deny-list: `localhost`, `127.0.0.1`, `staging.*` and `*.vercel.app`
are blocked, everything else is allowed.

If you see `VERCEL_ENV` back in either file, that is your answer.

### 3. Fix forward or roll back

Rolling back the deploy is usually fastest and always safe. Prefer it over a forward fix
under time pressure — every hour of `Disallow: /` costs more than a slightly messy revert.

After deploying either way, re-run the monitor (Actions → indexing-monitor → Run
workflow) and confirm it goes green. Do not close the incident on a local `curl` alone;
the monitor checks the header too.

### 4. Check the damage

- Google Search Console → Pages, and request indexing for key URLs
- Deindexing is not instant and neither is recovery. If it was live for more than a few
  hours, say so in the postmortem — traffic will lag the fix

---

## Indexing state changed (no ping)

Someone or something changed robots.txt or the `X-Robots-Tag` header. The alert shows
before and after: `-` is what it was, `+` is what it is now.

**Ask one question: did anyone intend this?**

- **Yes, and it looks right** (e.g. a new scoped `Disallow: /some-admin-path`) → nothing
  to do. The change is already recorded in `snapshots/indexing-state.json`, so the git
  history of that file is the audit trail
- **Yes, but it looks wrong** → treat as the 🚨 path above
- **Nobody knows** → treat as an incident until proven otherwise. An unexplained change
  to indexing controls on production is exactly the June shape

Things that look alarming but are fine:

- A `Sitemap:` URL changing host — check it still resolves, but this follows from
  FOX2-155 work
- Staging's `Disallow: /` appearing or moving — staging is *supposed* to be blocked. An
  alert saying staging *stopped* blocking is the real problem

---

## Known non-incidents

**Canonical warnings on foxbox.com.** The monitor reports `WARN` on canonical checks
because every page's `rel=canonical` points at the apex while the apex redirects to www
(FOX2-155, 261 pages). Known, tracked, non-paging. These become gating alerts once
FOX2-155 ships — see `CANONICAL_TIER` in `scripts/check-indexing.mjs`.

**Right after FOX2-155 deploys.** That ticket flips the primary host to the apex. The
monitor still expects www, so the redirect-direction check will fail on a correctly
configured site. The fix is to swap `origin` and `redirectFrom` for `foxbox` in
`scripts/check-indexing.mjs` — flagged inline in the file. If you get a redirect-direction
alert and FOX2-155 just shipped, this is why.

---

## Running it yourself

```bash
npm run monitor                                   # assert everything
node scripts/check-indexing.mjs foxbox            # one site
node scripts/check-indexing.mjs --snapshot        # current state as JSON
VERBOSE=1 npm run monitor                         # show detail on passing checks too
```

Dependency-free — no `npm ci`, no browser. It runs anywhere Node 20+ does, which is
deliberate: it has to keep working when the rest of the tooling doesn't.

## When the monitor itself is the problem

If it is alerting on something that isn't real, **fix or downgrade the check, don't mute
the workflow.** A muted monitor is worse than no monitor, because it looks like coverage.
Non-paging warnings exist for exactly this — see the two-tier system in the script header.
