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
7. Keep all revival decisions documented so the branch can be reviewed locally.

## Current project problems and status

### 1. Maintenance restart

Status: In progress.

The project has open issues and PRs that make it look unmaintained. This branch starts a practical revival without replacing the entire project.

Actions completed:

- Created working branch `revive/main-issue-triage`.
- Added this `plan.md`.
- Added `REVIVAL_NOTES.md` to document exact changes and testing expectations.

### 2. Testing gap

Status: Partially addressed.

`package.json` had no real test command. Full automated browser testing still needs local setup, but this branch adds a manual browser regression page.

Actions completed:

- Added `tests/manual/regression.html`.
- Updated `package.json` test script to point maintainers to the manual test page instead of failing immediately.

Manual tests cover:

- opening and closing dialogs,
- escape key behavior,
- background dismiss behavior,
- dynamic content APIs,
- jQuery compatibility checks,
- safer icon rendering.

Still needed:

- Run the manual page locally.
- Later replace/augment manual tests with automated browser tests.

### 3. jQuery 4 compatibility

Status: Patched in compatibility layer; local testing required.

Open PR #597 replaces deprecated `$.trim()` usage. This branch adds a compatibility patch instead of directly rewriting the original source.

Actions completed:

- Added `js/jquery-confirm-revival.js`.
- Replaced parser usage of `$.trim()` with native `String(value).trim()` inside patched parser methods.

Affected behavior:

- theme parsing,
- animation parsing,
- background dismiss animation parsing.

Still needed:

- Test with jQuery 3.7.x.
- Test with jQuery 4.x beta/RC if available.
- Decide whether to merge PR #597, close it, or replace it with this implementation.

### 4. Security hardening

Status: Patched in compatibility layer; local testing required.

Open PR #528 reports HTML injection/XSS concerns around icon class handling. The current code constructs icon HTML strings. This branch patches icon rendering without directly editing the old source.

Actions completed:

- Patched `setIcon()` to create `<i>` safely and apply classes through `.addClass()`.
- Patched `closeIconClass` handling to avoid string-concatenated HTML.

Still needed:

- Test normal icon classes.
- Test malicious-looking class input manually.
- Decide whether to fold this patch directly into `js/jquery-confirm.js`.

### 5. Escape key disabled-button bug

Status: Patched in compatibility layer; local testing required.

Issue #584 says pressing Escape still triggers a disabled button when `escapeKey` is bound to that button.

Actions completed:

- Added `_isButtonActionable()`.
- Added `_triggerButtonAction()`.
- Patched `reactOnKey()` to avoid disabled/hidden buttons.
- Patched click behavior so disabled/hidden button actions are ignored.

Expected behavior:

- If Escape is bound to a disabled button, do nothing.
- If Escape is bound to a hidden button, do nothing.
- If Escape is bound to an enabled visible button, keep existing behavior.

### 6. Dynamic content API bug

Status: Patched in compatibility layer; local testing required.

Issue #596 says `setContent()` / `setContentAppend()` are not working as expected. The old `setContentAppend()` and `setContentPrepend()` only update `contentParsed` and do not reliably refresh visible content.

Actions completed:

- Added `_ensureContentMounted()`.
- Patched `setContent()`.
- Patched `setContentAppend()`.
- Patched `setContentPrepend()`.
- Methods now return the instance for chaining.

Expected behavior to verify:

- `setContent()` replaces visible content.
- `setContentAppend()` appends to visible content after the dialog is open.
- `setContentPrepend()` prepends to visible content after the dialog is open.
- AJAX loading state is not broken.

### 7. Background dismiss issue

Status: Reproduction coverage added; no direct bug fix yet.

Issue #595 reports background dismiss not working, but currently has no body/details. Without reproduction details, changing behavior directly is risky.

Actions completed:

- Added manual regression case for `backgroundDismiss: true`.
- Patched background-dismiss button-key path to respect disabled/hidden target buttons.

Still needed:

- Run local reproduction.
- If failure reproduces, identify whether issue is config, CSS overlay, event propagation, or plugin logic.

### 8. Spam cleanup

Status: Pending / can be done from issue tracker.

Some open issues are spam and should be closed/locked/deleted if appropriate.

Known example:

- Issue #590

## Files changed in this revival branch

- `plan.md` — revival plan and status tracker.
- `REVIVAL_NOTES.md` — detailed explanation of what changed and why.
- `js/jquery-confirm-revival.js` — compatibility and bug-fix patch layer.
- `tests/manual/regression.html` — browser manual regression page.
- `package.json` — package entry points to revival patch and documents manual test command.

## Suggested local testing flow

1. Pull branch `revive/main-issue-triage`.
2. Open `tests/manual/regression.html` in Chrome/Chromium.
3. Click every test button and note pass/fail output.
4. Repeat in Firefox.
5. Test an existing demo page with the patch loaded after `js/jquery-confirm.js`.
6. Test package usage through `require('jquery-confirm')` if this repo is packed locally.
7. Report any failure with browser name/version and console error.

## Suggested next PR sequence after local testing

1. If the patch works, open a draft PR from `revive/main-issue-triage` into `master`.
2. Decide whether to keep `js/jquery-confirm-revival.js` as a transitional layer or fold the patch into `js/jquery-confirm.js`.
3. Generate/update minified distribution files if required.
4. Close obvious spam.
5. Review old open PRs one by one against current `master`.

## Testing policy for revival work

Every PR should include a `Testing` section with one of these formats:

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

## Current testing status

Testing:

- Not run in this environment.
- Reason: changes were made through the GitHub connector only.
- Local browser testing is required before merge.
