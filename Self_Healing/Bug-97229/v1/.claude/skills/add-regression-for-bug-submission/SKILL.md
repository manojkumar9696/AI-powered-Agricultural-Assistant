---
name: add-regression-for-bug-submission
description: Add focused automated regression coverage for the raise-ticket flow from settings, especially downstream push failures.
---

# /add-regression-for-bug-submission

1. Find the existing test framework in the codebase used by the affected application layer.
2. Add tests at the lowest practical level:
   - service or API tests if the push/create operation is server-side
   - component or interaction tests if the failure handling is primarily in the UI
3. Mock the downstream push/create dependency to force an exception or failure response.
4. Assert that the application converts the failure into the expected error contract, status code, or user-visible message.
5. Add a matching success-path test so both branches are protected.
6. If the repository stores QA scenario documentation, update it to mention the push-failure regression case for traceability.
7. Execute the repository's CI test command and confirm the new tests run in the existing pipeline.
