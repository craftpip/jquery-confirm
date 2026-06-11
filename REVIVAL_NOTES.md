# jquery-confirm revival notes

Branch: `revive/main-issue-triage`
Base branch: `master`

This branch is a practical restart for the existing project. It does not attempt another rewrite. The goal is to keep the current `master` code usable while applying small compatibility and safety fixes.

## What changed

### 1. Added a revival compatibility patch

File added:

- `js/jquery-confirm-revival.js`

This file is loaded after the original `js/jquery-confirm.js` and patches the existing runtime in-place.

Why this approach was used:

- The project has been dormant for a long time.
- Rewrites have already failed multiple times.
- A patch layer lets us stabilize behavior without destroying the old public API.
- The original source remains available for comparison.

### 2. jQuery 4 compatibility groundwork

Problem:

- The old runtime uses `$.trim()`.
- `$.trim()` is removed/deprecated in newer jQuery versions.

Fix:

- The revival patch replaces the parser methods that used `$.trim()` with native `String(value).trim()`.

Affected behavior:

- theme parsing
- animation parsing
- background dismiss animation parsing

Related PR:

- #597

### 3. Safer icon rendering

Problem:

- The old runtime builds icon HTML using string concatenation.
- This is risky for HTML injection when class values are user-controlled.

Fix:

- The revival patch creates `<i>` elements with jQuery and applies classes via `.addClass()`.

Affected behavior:

- `setIcon()`
- `closeIconClass`

Related PR / issue area:

- #528
- #508

### 4. Disabled buttons no longer trigger from keyboard helpers

Problem:

- Issue #584 reports Escape can trigger a disabled button when `escapeKey` is bound to that button.
- Keyboard helper logic directly triggered button clicks.

Fix:

- Added `_isButtonActionable()`.
- Added `_triggerButtonAction()`.
- Escape-key and button-key handlers now avoid disabled/hidden buttons.

Related issue:

- #584

### 5. Dynamic content APIs update visible content

Problem:

- Issue #596 reports `setContent()` / `setContentAppend()` not working as expected.
- The old `setContentAppend()` and `setContentPrepend()` only updated the internal `contentParsed` node.

Fix:

- Added `_ensureContentMounted()`.
- `setContentAppend()` now updates visible content.
- `setContentPrepend()` now updates visible content.
- `setContent()` returns the instance for chaining and refreshes height.

Related issue:

- #596

### 6. Background dismiss regression coverage

Problem:

- Issue #595 reports background dismiss not working, but there is no reproduction body.

Fix / action:

- Added a manual regression case that simulates background dismiss.
- No deeper source change was made yet because the issue needs reproduction details.

Related issue:

- #595

### 7. Manual regression page added

File added:

- `tests/manual/regression.html`

It covers:

- jQuery trim compatibility
- safe icon rendering
- disabled Escape button behavior
- dynamic content API behavior
- background dismiss behavior

## How to test locally

From a local checkout of this branch:

1. Open `tests/manual/regression.html` in a browser.
2. Click each test button.
3. Confirm the result panel shows pass messages.
4. Also test existing demo pages to make sure old behavior is not broken.

Suggested browser pass:

- Chrome / Chromium latest
- Firefox latest
- Safari if available

## Important note about testing here

These changes were made using the GitHub connector only. They were not executed locally in this environment. Local browser testing is still required before merge.

## Next recommended work

1. Pull this branch locally.
2. Run the manual regression page.
3. Test existing demo pages.
4. If the patch behaves correctly, decide whether to:
   - keep the compatibility patch as a transitional layer, or
   - fold these fixes directly into `js/jquery-confirm.js` and rebuild/minify distribution files.
5. After that, review old open PRs one by one and close/merge/recreate as needed.
