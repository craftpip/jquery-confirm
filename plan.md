# jquery-confirm revival plan

Working branch: `revive/main-issue-triage`
Base branch: `master`
Base commit: `d7df98c2e71e685172be4399bd6c296cd4d1de4c`

## Goal

Bring `jquery-confirm` back to a maintainable state without restarting another rewrite. The current `master` branch is the source of truth. Older rewrite branches should be treated as historical experiments unless a specific useful idea is intentionally cherry-picked later.

## Ground rules

1. Fix against `master` first.
2. Avoid large rewrites until the existing project has tests and confidence.
3. Prefer small, reviewable pull requests.
4. Each bug fix should link to an issue when possible.
5. Every patch should include one of:
   - a regression test,
   - a manual reproduction page/example,
   - or a clear note explaining why it was not testable yet.
6. Do not merge risky behavior changes without documenting compatibility impact.

## Current project problems to address

### 1. Maintenance restart

The project has open issues and PRs that make it look unmaintained. First step is to triage current issues, close spam, mark duplicates, and identify small fixes that can be merged safely.

### 2. Testing gap

`package.json` currently has no real test command. This makes every fix risky. We need a lightweight browser-based test setup for core behavior:

- opening and closing dialogs,
- button actions,
- escape key behavior,
- background dismiss behavior,
- dynamic content APIs,
- jQuery compatibility checks.

Candidate approach:

- keep the source structure mostly unchanged,
- add a small test harness using a browser-capable runner,
- add regression tests for each bug fixed.

### 3. jQuery 4 compatibility

Open PR #597 replaces deprecated `$.trim()` usage. This should be reviewed against `master`, tested, and either merged or recreated as a clean patch.

Files likely affected:

- `js/jquery-confirm.js`
- generated/minified distribution files if the repo expects them to be committed

### 4. Security hardening

Open PR #528 reports HTML injection/XSS concerns around icon class handling. The current code constructs HTML strings for icon markup. This should be replaced with safe DOM creation and `.addClass()` where compatible.

Likely areas:

- `setIcon()`
- `closeIconClass` handling

### 5. Escape key disabled-button bug

Issue #584 says pressing Escape still triggers a disabled button when `escapeKey` is bound to that button. The fix should ensure keyboard-triggered button actions respect disabled/hidden state.

Likely area:

- `reactOnKey()`

Expected behavior:

- If escape is bound to a disabled button, do nothing.
- If escape is bound to an enabled button, keep existing behavior.

### 6. Dynamic content API bug

Issue #596 says `setContent()` / `setContentAppend()` are not working as expected. Current `setContentAppend()` only updates `contentParsed`, while `setContent()` is the function that re-renders `$content`.

Likely area:

- `setContentPrepend()`
- `setContentAppend()`
- `setContent()`

Expected behavior to verify:

- `setContent()` replaces visible content.
- `setContentAppend()` appends to visible content after the dialog is open.
- `setContentPrepend()` prepends to visible content after the dialog is open.
- AJAX loading state is not broken.

### 7. Background dismiss issue

Issue #595 reports background dismiss not working, but currently has no body/details. This needs reproduction before code changes.

Action:

- ask for reproduction or create a minimal local reproduction against `master`,
- verify whether it is a config misunderstanding, CSS overlay issue, or actual event handling bug.

### 8. Spam cleanup

Some open issues are spam and should be closed/locked/deleted if appropriate.

Known example:

- Issue #590

## Suggested first PR sequence

1. Add basic maintenance files and test plan.
2. Add a minimal test harness.
3. Fix jQuery 4 `$.trim()` compatibility.
4. Fix Escape key triggering disabled buttons.
5. Fix safe icon rendering / XSS hardening.
6. Fix dynamic content append/prepend rendering.
7. Triage stale support requests and close spam.
8. Review old open PRs one by one against current `master`.

## Issue triage labels to consider

- `bug`
- `feature request`
- `support`
- `security`
- `needs reproduction`
- `good first issue`
- `duplicate`
- `stale`
- `spam`

## Testing policy for revival work

Until automated tests exist, every PR should include a `Testing` section with one of these formats:

```md
Testing:
- Added/updated regression test: <test name>
- Verified manually in browser: <browser/version>
```

or:

```md
Testing:
- Not run. Reason: <clear reason>
```

## Immediate next action

Start with a small patch that is easy to verify. Best candidates:

1. jQuery 4 `$.trim()` compatibility.
2. Escape key should not trigger disabled button actions.
3. Dynamic `setContentAppend()` / `setContentPrepend()` should update visible content.
