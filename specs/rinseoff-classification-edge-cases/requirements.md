# Implementation Requirements Checklist

**Purpose**: Provide an implementation acceptance checklist that agents can execute one item at a time.
**Feature**: Save rinse-off classification at the 20-minute contact time boundary; Handle product registry search returning no matching products without blocking classification workflow.

---

## Functional Acceptance Criteria

### US AUTO-18: Rinse-Off Classification Save at 20-Minute Boundary

- [ ] [R1] Selecting "Cosmetic" in the "Primary Category" dropdown of the "Classification Setup" card enables the "Sub-Category" dropdown and populates it with cosmetic sub-category options from the lookup source
- [ ] [R2] Selecting "Rinse-Off" in the "Sub-Category" dropdown activates the "Exposure & Usage Attributes" section, displaying mandatory fields: Contact Time, Dilution Factor, Application Method, Target Body Area, and Exposure Duration Band
- [ ] [R3] The Contact Time field accepts the value `20` (the maximum allowed boundary) without triggering inline validation errors
- [ ] [R4] The Dilution Factor field accepts `1.0`, Application Method accepts "Massage and rinse", Target Body Area accepts "Scalp and Hair", and Exposure Duration Band accepts "5–20 min" — all without inline validation errors
- [ ] [R5] A helper rule callout is displayed in informational-only mode (not as a blocking validation) when boundary values are entered
- [ ] [R6] The "Usage Notes" free-text field accepts input (e.g., "Boundary value save test")
- [ ] [R7] The "Regulatory Effects Preview" panel on the right side shows linked regulatory frameworks and requirement placeholders relevant to rinse-off cosmetics before save is triggered
- [ ] [R8] Clicking "Save Classification" in the sticky footer action bar submits `POST /api/products/{productId}/classification` with all entered field values
- [ ] [R9] On successful save, a success toast appears with the exact message "Classification saved successfully."
- [ ] [R10] After save, the product status transitions to a saved/classified state
- [ ] [R11] The classification summary displays "Cosmetic / Rinse-Off" with Contact Time = 20 min and all other saved attribute values
- [ ] [R12] The audit activity panel records a successful classification save entry with a timestamp
- [ ] [R13] Downstream regulatory requirements are shown as generated or finalized for the rinse-off classification in the audit timeline

### US AUTO-19: Product Registry Search — No Matching Products

- [ ] [R14] The "Product Classification" module loads from the regulatory workspace dashboard with a product table, filter bar, and search input labeled "Search by product name, SKU, or ID"
- [ ] [R15] Entering a non-matching search term (e.g., "ZZZ-NO-MATCH-999") and applying the search causes the product registry table to refresh and return zero rows
- [ ] [R16] When zero results are returned, a dedicated empty-state message is displayed inside the table area (not a broken, blank, or error state)
- [ ] [R17] While the empty state is displayed, the Market filter, Status filter, and "Clear filters" control remain visible and interactive
- [ ] [R18] Clicking "Clear filters" clears the search input, removes the empty state, and reloads the default product registry rows
- [ ] [R19] After clearing filters, clicking the "Classify" button on a product row (e.g., "ABCD Shampoo") successfully opens the classification detail view, confirming no residual invalid state from the empty search

---

## UI Acceptance Criteria

- [ ] [R20] The "Classification Setup" card renders Primary Category and Sub-Category dropdowns; Sub-Category is disabled until a Primary Category is selected
- [ ] [R21] The "Exposure & Usage Attributes" section is hidden or inactive until "Rinse-Off" sub-category is selected
- [ ] [R22] Inline validation messages appear only for actual constraint violations; the helper rule callout is styled as informational (e.g., info icon/color, not error)
- [ ] [R23] The "Save Classification" button is located in a sticky footer action bar that remains visible during scroll
- [ ] [R24] The success toast follows existing application toast conventions (positioning, auto-dismiss timing, styling)
- [ ] [R25] The product registry search input has a visible label or placeholder: "Search by product name, SKU, or ID"
- [ ] [R26] The empty-state display in the product table uses a user-friendly illustration or message (not a raw empty table or error)
- [ ] [R27] Filter controls (Market, Status, Clear filters) maintain consistent styling and placement whether the table has results or is in empty state
- [ ] [R28] The "Regulatory Effects Preview" panel is positioned on the right side of the classification form
- [ ] [R29] All interactive controls (dropdowns, inputs, buttons, filters) are keyboard-accessible and have appropriate ARIA labels or roles
- [ ] [R30] The layout is responsive and does not break on standard viewport widths used by the application

---

## API and Integration Acceptance Criteria

- [ ] [R31] `POST /api/products/{productId}/classification` accepts a request body containing at minimum: primaryCategory, subCategory, contactTime, dilutionFactor, applicationMethod, targetBodyArea, exposureDurationBand, and usageNotes
- [ ] [R32] The endpoint validates that contactTime ≤ 20 (maximum boundary) and returns a `200`/`201` success response when the value is exactly `20`
- [ ] [R33] The endpoint returns appropriate validation error responses (e.g., `422`) when contactTime exceeds 20
- [ ] [R34] The save operation completes and returns a response within 1 second under normal load
- [ ] [R35] The product registry search API (used by the product table) returns an empty result set (not an error) when no products match the query
- [ ] [R36] The lookup source for cosmetic sub-category options is fetched and populates the Sub-Category dropdown reliably
- [ ] [R37] Downstream regulatory requirement generation is triggered upon successful classification save (audit trail reflects this)
- [ ] [R38] Existing API contracts for product listing, filtering, and classification are not broken by these changes

---

## Business Logic and Data Acceptance Criteria

- [ ] [R39] Contact Time has a maximum allowed value of 20 minutes; values at this boundary are accepted and persisted
- [ ] [R40] Contact Time values exceeding 20 are rejected with a clear validation message
- [ ] [R41] The "Exposure Duration Band" value "5–20 min" is consistent with a Contact Time of 20
- [ ] [R42] Selecting "Rinse-Off" sub-category determines which mandatory fields appear and which regulatory frameworks are linked
- [ ] [R43] Product status transitions from its prior state to saved/classified upon successful classification save
- [ ] [R44] An audit log entry is created for every successful classification save, capturing the user, timestamp, and classification details
- [ ] [R45] Regulatory requirements linked to rinse-off cosmetics are generated or finalized as a downstream effect of save
- [ ] [R46] A product registry search returning zero results does not alter any persisted state or corrupt the module's client-side state
- [ ] [R47] Clearing filters restores the default (unfiltered) product list from the data source

---

## Non-Functional Acceptance Criteria

- [ ] [R48] The classification save round-trip (client submit → server persist → client success state) completes in under 1 second under normal conditions
- [ ] [R49] The product registry search and empty-state rendering do not produce JavaScript errors or unhandled exceptions in the browser console
- [ ] [R50] The monolith architecture style is followed; no new microservice or separate deployment unit is introduced
- [ ] [R51] Permission/authorization checks are enforced on `POST /api/products/{productId}/classification` (only authorized users can save)
- [ ] [R52] The audit trail entries are tamper-resistant and include sufficient detail for regulatory traceability
- [ ] [R53] Tests cover: (a) saving classification at contactTime = 20, (b) rejection at contactTime > 20, (c) empty search result rendering, (d) filter clearing restores default state, (e) navigation to classify after empty search

---

## Traceability

- [ ] [R54] Every classification form field, validation rule, and save behavior maps to US AUTO-18 validation steps
- [ ] [R55] Every product registry search, empty-state, filter, and navigation behavior maps to US AUTO-19 validation steps
- [ ] [R56] The `POST /api/products/{productId}/classification` endpoint and its response-time requirement trace to US AUTO-18 step 5
- [ ] [R57] The success toast message text "Classification saved successfully." traces to US AUTO-18 step 6
- [ ] [R58] The empty-state display requirement traces to US AUTO-19 step 3
- [ ] [R59] Every non-blocking Open Question that was implemented has a recorded decision and one-line rationale in `specs/<slug>/assumptions.md`
- [ ] [R60] No BLOCKING Open Question was implemented as an assumption

---

## Assumptions

### ASM-1
- [R61] **Statement**: Contact Time values below 0 (negative) or non-numeric inputs are rejected with inline validation errors, even though the source only explicitly specifies the upper boundary of 20.
- [R62] **Source**: US AUTO-18 — Contact Time field behavior and "maximum allowed contact time boundary" phrasing.
- [R63] **Rationale**: Standard numeric input validation requires a sane lower bound; accepting negative or non-numeric contact times would be a data integrity issue.
- [R64] **Potential impact**: If the actual domain allows 0 as a valid contact time (e.g., instant rinse), the lower bound rule may need adjustment.
- [R65] **Confidence**: high
- [R66] **Recommended resolution**: Confirm with product owner whether 0 is a valid Contact Time and document the accepted range.

### ASM-2
- [R67] **Statement**: The product registry search is performed via a GET API call with query parameters (search term, market filter, status filter) and returns an empty array (not an error object) when no products match.
- [R68] **Source**: US AUTO-19 — "The product registry table refreshes and returns no matching rows."
- [R69] **Rationale**: Returning an empty collection for zero-match queries is standard REST convention and is required for the UI to render the empty state rather than an error state.
- [R70] **Potential impact**: If the existing API returns a different structure (e.g., a wrapper with a count field), the front-end empty-state logic must adapt.
- [R71] **Confidence**: high
- [R72] **Recommended resolution**: Validate against the existing product registry API response schema.

## Additional Features

### ASM-3
- [R73] **Statement**: The "Classify" button on each product row navigates to a classification detail view route (e.g., `/products/{productId}/classification`) within the same monolith SPA, not an external link.
- [R74] **Source**: US AUTO-19 — "The system opens the 'ABCD Shampoo' classification detail view successfully."
- [R75] **Rationale**: The monolith architecture style and the described navigation flow imply in-app routing.
- [R76] **Potential impact**: Minimal; if the classification view is a separate page load rather than SPA navigation, the implementation pattern changes slightly.
- [R77] **Confidence**: high
- [R78] **Recommended resolution**: Confirm routing strategy with the existing codebase.

---

## Notes

- [R79] Never resolve an Open Question silently. In an unattended run, record the chosen assumption and rationale in `specs/<slug>/assumptions.md`; blocking questions must instead hold the feature at `needs-clarification`.
- [R80] Mark an item complete only after verifying actual implementation code and behavior.
- [R81] The exact product ID `PRD-10428` referenced in US AUTO-18 is treated as a test fixture identifier; the implementation must support any valid product ID in the route.
- [R82] The search term `ZZZ-NO-MATCH-999` in US AUTO-19 is a test input; the empty-state behavior must apply for any search yielding zero results.