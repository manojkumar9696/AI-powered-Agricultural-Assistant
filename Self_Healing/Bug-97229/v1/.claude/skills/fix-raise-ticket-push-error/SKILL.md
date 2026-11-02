---
name: fix-raise-ticket-push-error
description: Locate the /settings raise-ticket flow, harden push/create error handling, and add regression coverage for submission failures.
---

# /fix-raise-ticket-push-error

1. Reproduce the defect from the settings page flow referenced in the bug: raising a ticket from `/settings` currently results in a generic push error.
2. Search the codebase for the settings page implementation and the raise-ticket action handler. Look for strings such as `settings`, `raise ticket`, `bug`, `push`, `create`, or the page route.
3. Identify the exact boundary where the UI calls an API/service and where that API/service performs the downstream push or bug-record creation.
4. Inspect the request payload assembly and confirm required fields are present before the push/create operation executes.
5. Add narrow validation for required submission fields so malformed requests fail early with a clear, stable error.
6. Wrap the downstream push/create call in explicit error handling.
7. Normalize failure responses so callers receive a deterministic result structure or status code instead of an opaque exception or raw provider failure.
8. Update the settings UI behavior to display a meaningful failure message and avoid losing the user-entered context after a failed submission.
9. Add regression tests for:
   - successful raise-ticket submission
   - downstream push/create failure
   - validation failure for incomplete payloads, if applicable
10. Run the repository test hook and ensure the new regression is covered by CI.
11. Keep the change scoped to the raise-ticket flow only; do not refactor unrelated settings or CI code.
