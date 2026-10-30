# Feature: Save rinse-off classification successfully at the maximum allowed contact time boundary of 20 minutes; Handle product registry search returning no matching products without blocking classification workflow
Status: NEW
Owner: Astra
Last Updated: 2026-10-30

## Summary

This feature addresses two distinct but related capabilities within the Product Classification module of a regulatory workspace application:

1. **Rinse-off classification save at maximum contact time boundary** — A user must be able to classify a cosmetic product as "Rinse-Off" with a contact time of exactly 20 minutes (the maximum allowed boundary value), save the classification successfully via the API, and confirm the saved state including audit trail and downstream regulatory effects.

2. **Product registry search with no matching results** — When a user searches the product registry and no products match the query, the system must display a graceful empty state without breaking the table layout, leaving filters interactive, and allowing the user to clear filters and resume normal workflow including navigating into a product classification detail view.

Together, these capabilities ensure boundary-value correctness for rinse-off classification data entry and resilient UX behavior when the product registry search yields zero results.

## Scope

### In Scope

- Classification form behavior for "Cosmetic / Rinse-Off" sub-category selection, including field activation and mandatory field display.
- Boundary-value acceptance of Contact Time = 20 minutes without inline validation errors.
- Successful save of rinse-off classification via `POST /api/products/{productId}/classification`.
- Success toast notification, product status transition, and classification summary display after save.
- Audit activity panel entry for the classification save event.
- Downstream regulatory requirement generation or finalization upon rinse-off classification save.
- Regulatory Effects Preview panel behavior before save.
- Product registry search with no matching results returning a well-formed empty state.
- Filter controls (market filter, status filter, "Clear filters" link) remaining interactive during empty state.
- Recovery from empty state via "Clear filters" to reload default product registry rows.
- Navigation from empty-state recovery into a product classification detail view ("Classify" button).

### Out of Scope

- Classification types other than "Cosmetic / Rinse-Off" (e.g., leave-on, professional-use).
- Contact time values other than the 20-minute boundary (lower bound, mid-range, or values exceeding 20).
- Product creation, deletion, or editing outside of classification.
- Bulk classification operations.
- Detailed regulatory framework rule engine logic beyond confirming generation/finalization occurs.
- Authentication and authorization flows (unless specified below under Open Questions).

## Application Type & Platform Context

The feature targets a **mixed** application: a web-based front-end UI (regulatory workspace dashboard, product classification module, forms, tables, toast notifications) backed by a server-side API (`POST /api/products/{productId}/classification`).

**Source evidence:**
- "The system submits POST /api/products/PRD-10428/classification, completes the save in under 1 second, and displays a success state instead of validation errors." (US AUTO-18)
- "Navigate from the regulatory workspace dashboard to the 'Product Classification' module." (US AUTO-19)
- "The registry page loads with the product table, filter bar, and search input." (US AUTO-19)
- Derived Application Type signal: `mixed`.

## Actors and Permissions

| Actor | Description | Source Evidence |
|---|---|---|
| Regulatory Workspace User | A user who navigates the regulatory workspace dashboard, searches the product registry, and performs product classification. | Implied by all validation steps in US AUTO-18 and US AUTO-19. |

> **Open Question OQ-1:** What specific roles or permissions are required to access the Product Classification module, perform classification saves, and view the audit activity panel? The source does not define role-based access controls.

## Feature Development Intent

This is feature-development work requiring:

1. **Form behavior implementation** — The Classification Setup card must dynamically enable the Sub-Category dropdown upon Primary Category selection, and activate the Exposure & Usage Attributes section with mandatory fields when "Rinse-Off" is selected.
2. **Boundary-value validation logic** — The Contact Time field must accept 20 as a valid maximum value without triggering inline validation errors.
3. **API integration for classification save** — A `POST /api/products/{productId}/classification` endpoint must accept the classification payload and persist it.
4. **Post-save state management** — The UI must display a success toast, update product status, render the classification summary, populate the audit timeline, and trigger downstream regulatory requirement generation.
5. **Resilient empty-state handling** — The product registry search must gracefully handle zero-result responses with a proper empty state, keep filter controls interactive, and allow full recovery to the default view.
6. **Navigation integrity** — After recovering from an empty search state, the user must be able to open a product classification detail view without encountering stale or invalid module state.

The expected outcome is a robust classification workflow that handles edge cases (maximum boundary values, empty search results) without data loss, UI breakage, or workflow interruption.

## UI Design & Interaction Contract

### Classification Setup Card (US AUTO-18)

| Element | Behavior | Source Evidence |
|---|---|---|
| **Primary Category dropdown** | Displays category options. Selecting "Cosmetic" enables the Sub-Category dropdown and populates it with cosmetic sub-category options loaded from a lookup source. | US AUTO-18, Validation Step 1 |
| **Sub-Category dropdown** | Initially disabled. Becomes enabled upon Primary Category selection. Selecting "Rinse-Off" activates the Exposure & Usage Attributes section. | US AUTO-18, Validation Steps 1–2 |
| **Exposure & Usage Attributes section** | Becomes active when Sub-Category = "Rinse-Off". Displays mandatory fields: Contact Time, Dilution Factor, Application Method, Target Body Area, Exposure Duration Band. | US AUTO-18, Validation Step 2 |
| **Contact Time field** | Numeric input. Accepts value "20" without inline validation errors. Maximum allowed value is 20 minutes. | US AUTO-18, Validation Step 3 |
| **Dilution Factor field** | Numeric input. Accepts value "1.0". | US AUTO-18, Validation Step 3 |
| **Application Method** | Selection control. Options include "Massage and rinse". | US AUTO-18, Validation Step 3 |
| **Target Body Area** | Selection control. Options include "Scalp and Hair". | US AUTO-18, Validation Step 3 |
| **Exposure Duration Band** | Selection control. Options include "5–20 min". | US AUTO-18, Validation Step 3 |
| **Helper rule callout** | Displayed as informational only when all values are valid; must not display as an error or warning at boundary values. | US AUTO-18, Validation Step 3 |
| **Usage Notes field** | Free-text input. Accepts arbitrary text (e.g., "Boundary value save test"). | US AUTO-18, Validation Step 4 |

### Regulatory Effects Preview Panel (US AUTO-18)

| Element | Behavior | Source Evidence |
|---|---|---|
| **Right-side panel** | Displays linked regulatory frameworks for rinse-off cosmetics and requirement placeholders before save. Indicates the rinse-off classification context is recognized. | US AUTO-18, Validation Step 4 |

### Sticky Footer Action Bar (US AUTO-18)

| Element | Behavior | Source Evidence |
|---|---|---|
| **Save Classification button** | Located in a sticky footer action bar. Triggers the classification save API call. | US AUTO-18, Validation Step 5 |

### Post-Save State (US AUTO-18)

| Element | Behavior | Source Evidence |
|---|---|---|
| **Success toast** | Displays message: "Classification saved successfully." | US AUTO-18, Validation Step 6 |
| **Product status** | Changes to a saved/classified state. | US AUTO-18, Validation Step 6 |
| **Classification summary** | Shows "Cosmetic / Rinse-Off" with saved values including Contact Time = 20 min. | US AUTO-18, Validation Step 6 |

### Audit Activity Panel (US AUTO-18)

| Element | Behavior | Source Evidence |
|---|---|---|
| **Audit timeline** | Contains a successful classification save entry. Downstream regulatory requirements shown as generated or finalized. | US AUTO-18, Validation Step 7 |

### Product Registry Page (US AUTO-19)

| Element | Behavior | Source Evidence |
|---|---|---|
| **Product table** | Displays product rows. Refreshes on search. | US AUTO-19, Validation Step 1 |
| **Filter bar** | Contains market filter, status filter, and "Clear filters" control. | US AUTO-19, Validation Steps 1, 4, 5 |
| **Search input** | Labeled "Search by product name, SKU, or ID". Accepts text input and triggers search on apply. | US AUTO-19, Validation Step 1 |
| **Empty state** | Displayed when search returns no matching rows. Must not render as a broken or blank table. Must indicate that no products match the current filters. | US AUTO-19, Validation Step 3 |
| **Filter controls during empty state** | Market filter, status filter, and "Clear filters" control remain available and interactive. | US AUTO-19, Validation Step 4 |
| **"Clear filters" link** | Clears the search value, removes the empty state, and reloads default product registry rows. | US AUTO-19, Validation Step 5 |
| **"Classify" button** | Appears per product row. Opens the product classification detail view. Must function correctly after recovering from an empty search state. | US AUTO-19, Validation Step 6 |

## API Contract

### Save Product Classification

| Attribute | Detail | Source Evidence |
|---|---|---|
| **Method** | POST | US AUTO-18, Validation Step 5 |
| **Path** | `/api/products/{productId}/classification` | US AUTO-18, Validation Step 5 (example: `/api/products/PRD-10428/classification`) |
| **Path Parameter** | `productId` — Product identifier (e.g., `PRD-10428`) | US AUTO-18, Validation Step 5 |
| **Request Body (inferred from form fields)** | Must include: Primary Category, Sub-Category, Contact Time, Dilution Factor, Application Method, Target Body Area, Exposure Duration Band, Usage Notes | US AUTO-18, Validation Steps 3–5 |
| **Success Response** | Save completes; UI transitions to success state. | US AUTO-18, Validation Steps 5–6 |
| **Performance** | Save completes in under 1 second. | US AUTO-18, Validation Step 5 |
| **Side Effects** | Product status transitions to saved/classified state. Audit entry created. Downstream regulatory requirements generated or finalized. | US AUTO-18, Validation Steps 6–7 |

> **Open Question OQ-2:** What is the exact request body schema (field names, types, required/optional) for `POST /api/products/{productId}/classification`? The source provides form field names but not the API schema.

> **Open Question OQ-3:** What is the HTTP status code and response body structure for a successful classification save? The source confirms a success state but does not specify the response contract.

> **Open Question OQ-4:** What error response codes and body structures are returned for validation failures, not-found products, or server errors on this endpoint?

### Product Registry Search

> **Open Question OQ-5:** What is the API endpoint, method, and query parameter structure for the product registry search? The source describes UI behavior but does not specify the search API contract.

## Business Logic & Rules

| Rule ID | Rule | Source Evidence |
|---|---|---|
| BL-1 | When Primary Category is set to "Cosmetic", the Sub-Category dropdown must be enabled and populated with cosmetic sub-category options from a lookup source. | US AUTO-18, Validation Step 1 |
| BL-2 | When Sub-Category is set to "Rinse-Off", the Exposure & Usage Attributes section must activate and display mandatory fields: Contact Time, Dilution Factor, Application Method, Target Body Area, Exposure Duration Band. | US AUTO-18, Validation Step 2 |
| BL-3 | Contact Time has a maximum allowed value of 20 minutes. A value of exactly 20 must be accepted without validation errors. | US AUTO-18, Validation Step 3; feature title "maximum allowed contact time boundary of 20 minutes" |
| BL-4 | The helper rule callout must remain informational only (not error/warning) when all field values are valid, including boundary values. | US AUTO-18, Validation Step 3 |
| BL-5 | Before save, the Regulatory Effects Preview panel must recognize the rinse-off classification context and display linked frameworks and requirement placeholders. | US AUTO-18, Validation Step 4 |
| BL-6 | Upon successful classification save, the product status must transition to a saved/classified state. | US AUTO-18, Validation Step 6 |
| BL-7 | Upon successful classification save, an audit timeline entry must be created recording the classification save event. | US AUTO-18, Validation Step 7 |
| BL-8 | Upon successful classification save for a rinse-off product, downstream regulatory requirements must be generated or finalized. | US AUTO-18, Validation Step 7 |
| BL-9 | Product registry search returning zero results must display a well-formed empty state, not a broken or blank table. | US AUTO-19, Validation Step 3 |
| BL-10 | Filter controls (market filter, status filter, "Clear filters") must remain interactive when the product registry is in an empty state. | US AUTO-19, Validation Step 4 |
| BL-11 | Clicking "Clear filters" must clear the search value, remove the empty state, and reload the default product registry rows. | US AUTO-19, Validation Step 5 |
| BL-12 | The product classification module must not enter an invalid state after an empty search result; subsequent navigation to a product classification detail view must succeed. | US AUTO-19, Validation Step 6 |

## Data Model & Validation

### Product Classification Entity (source-supported fields)

| Field | Type (Inferred) | Validation | Source Evidence |
|---|---|---|---|
| Primary Category | Selection / Enum | Required. Must be a valid category (e.g., "Cosmetic"). | US AUTO-18, Validation Step 1 |
| Sub-Category | Selection / Enum | Required when Primary Category is set. Options loaded from lookup source. Must be a valid sub-category (e.g., "Rinse-Off"). | US AUTO-18, Validation Steps 1–2 |
| Contact Time | Numeric (minutes) | Required for Rinse-Off. Maximum allowed value: 20. Must accept exactly 20 without error. | US AUTO-18, Validation Step 3 |
| Dilution Factor | Numeric | Required for Rinse-Off. Accepts decimal values (e.g., 1.0). | US AUTO-18, Validation Step 3 |
| Application Method | Selection / Enum | Required for Rinse-Off. Options include "Massage and rinse". | US AUTO-18, Validation Step 3 |
| Target Body Area | Selection / Enum | Required for Rinse-Off. Options include "Scalp and Hair". | US AUTO-18, Validation Step 3 |
| Exposure Duration Band | Selection / Enum | Required for Rinse-Off. Options include "5–20 min". | US AUTO-18, Validation Step 3 |
| Usage Notes | Free text | Optional. | US AUTO-18, Validation Step 4 |

### Product Registry Entity (source-supported fields)

| Field | Type (Inferred) | Validation | Source Evidence |
|---|---|---|---|
| Product Name | Text | Searchable. | US AUTO-19, Validation Step 1 ("Search by product name, SKU, or ID") |
| SKU | Text | Searchable. | US AUTO-19, Validation Step 1 |
| Product ID | Text / Identifier | Searchable. Example: PRD-10428. | US AUTO-18, Validation Step 5; US AUTO-19, Validation Step 1 |
| Product Status | Enum / State | Transitions to saved/classified upon classification save. | US AUTO-18, Validation Step 6 |

> **Open Question OQ-6:** What is the minimum allowed value for Contact Time? The source specifies 20 as the maximum boundary but does not state the minimum.

> **Open Question OQ-7:** What are the complete lists of valid options for Application Method, Target Body Area, Exposure Duration Band, and Primary/Sub-Category? The source provides examples but not exhaustive enumerations.

> **Open Question OQ-8:** What is the maximum length or character constraint for the Usage Notes field?

## Functional Requirements

| Req ID | Requirement | Source |
|---|---|---|
| FR-1 | The system shall enable the Sub-Category dropdown and populate it with cosmetic sub-category options from the lookup source when the user selects "Cosmetic" as the Primary Category. | US AUTO-18, Step 1 |
| FR-2 | The system shall activate the Exposure & Usage Attributes section and display mandatory fields (Contact Time, Dilution Factor, Application Method, Target Body Area, Exposure Duration Band) when the user selects "Rinse-Off" as the Sub-Category. | US AUTO-18, Step 2 |
| FR-3 | The system shall accept a Contact Time value of exactly 20 (the maximum allowed boundary) without displaying inline validation errors. | US AUTO-18, Step 3 |
| FR-4 | The system shall display the helper rule callout as informational only when all entered values are valid, including boundary values. | US AUTO-18, Step 3 |
| FR-5 | The system shall display linked regulatory frameworks and requirement placeholders in the Regulatory Effects Preview panel for a rinse-off classification before save. | US AUTO-18, Step 4 |
| FR-6 | The system shall submit a POST request to `/api/products/{productId}/classification` when the user clicks "Save Classification". | US AUTO-18, Step 5 |
| FR-7 | The system shall complete the classification save and display a success state (not validation errors) upon successful API response. | US AUTO-18, Step 5 |
| FR-8 | The system shall display a success toast with the message "Classification saved successfully." after a successful save. | US AUTO-18, Step 6 |
| FR-9 | The system shall transition the product status to a saved/classified state after a successful classification save. | US AUTO-18, Step 6 |
| FR-10 | The system shall display a classification summary showing "Cosmetic / Rinse-Off" with saved values including Contact Time = 20 min after a successful save. | US AUTO-18, Step 6 |
| FR-11 | The system shall create an audit timeline entry recording the successful classification save event. | US AUTO-18, Step 7 |
| FR-12 | The system shall generate or finalize downstream regulatory requirements upon successful rinse-off classification save. | US AUTO-18, Step 7 |
| FR-13 | The product registry page shall load with a product table, filter bar, and search input labeled "Search by product name, SKU, or ID". | US AUTO-19, Step 1 |
| FR-14 | The system shall refresh the product registry table and return no matching rows when a search query matches no products. | US AUTO-19, Step 2 |
| FR-15 | The system shall display a well-formed empty state (not a broken or blank table) when the product registry search returns no results, indicating that no products match the current filters. | US AUTO-19, Step 3 |
| FR-16 | The system shall keep market filter, status filter, and "Clear filters" controls available and interactive when the product registry is in an empty state. | US AUTO-19, Step 4 |
| FR-17 | The system shall clear the search value, remove the empty state, and reload default product registry rows when the user clicks "Clear filters". | US AUTO-19, Step 5 |
| FR-18 | The system shall allow the user to open a product classification detail view via the "Classify" button after recovering from an empty search state, confirming no invalid module state persists. | US AUTO-19, Step 6 |

## Non-Functional Requirements

| NFR ID | Requirement | Source Evidence |
|---|---|---|
| NFR-1 | The classification save operation (`POST /api/products/{productId}/classification`) must complete in under 1 second. | US AUTO-18, Validation Step 5 |
| NFR-2 | The product registry table must not render in a broken or blank state under any search result condition, including zero results. | US AUTO-19, Validation Step 3 |

> **Open Question OQ-9:** Are there additional non-functional requirements for accessibility (e.g., WCAG compliance level), reliability (e.g., uptime SLA), security (e.g., input sanitization, CSRF protection), or observability (e.g., logging, monitoring) for this feature?

## Acceptance Scenarios

### Scenario 1: Save rinse-off classification at maximum contact time boundary (Happy Path)

```gherkin
Given the user is on the classification detail view for product "PRD-10428"
And the "Classification Setup" card is displayed
When the user selects "Cosmetic" in the "Primary Category" dropdown
Then the "Sub-Category" dropdown becomes enabled
And the "Sub-Category" dropdown displays cosmetic sub-category options loaded from the lookup source

When the user selects "Rinse-Off" in the "Sub-Category" dropdown
Then the "Exposure & Usage Attributes" section becomes active
And mandatory fields are displayed: Contact Time, Dilution Factor, Application Method, Target Body Area, Exposure Duration Band

When the user enters "20" in "Contact Time", "1.0" in "Dilution Factor", selects "Massage and rinse" for "Application Method", selects "Scalp and Hair" for "Target Body Area", and selects "5–20 min" for "Exposure Duration Band"
Then all entered values are accepted without inline validation errors
And the helper rule callout remains informational only

When the user enters "Boundary value save test" in "Usage Notes"
Then the "Regulatory Effects Preview" panel shows linked frameworks for rinse-off cosmetics and requirement placeholders

When the user clicks the "Save Classification" button in the sticky footer action bar
Then the system submits POST /api/products/PRD-10428/classification
And the save completes in under 1 second
And a success state is displayed instead of validation errors

Then a success toast appears stating "Classification saved successfully."
And the product status changes to a saved/classified state
And the classification summary shows "Cosmetic / Rinse-Off" with Contact Time = 20 min
```

### Scenario 2: Audit trail recorded after successful rinse-off classification save

```gherkin
Given the user has successfully saved a rinse-off classification for product "PRD-10428" with Contact Time = 20
When the user opens or reviews the audit activity panel for the saved record
Then the audit timeline contains a successful classification save entry
And downstream regulatory requirements are shown as generated or finalized for the rinse-off classification
```

### Scenario 3: Product registry search returns no matching products (Empty State)

```gherkin
Given the user has navigated to the "Product Classification" module from the regulatory workspace dashboard
And the registry page is loaded with the product table, filter bar, and search input labeled "Search by product name, SKU, or ID"
When the user enters "ZZZ-NO-MATCH-999" into the search input and applies the search
Then the product registry table refreshes and returns no matching rows
And an empty registry state is displayed instead of a broken or blank table
And the empty state indicates that no products match the current filters
```

### Scenario 4: Filter controls remain interactive during empty state

```gherkin
Given the product registry is displaying an empty state after a search returning no results
When the user inspects the filter controls
Then the market filter, status filter, and "Clear filters" control remain available and interactive
```

### Scenario 5: Clear filters recovers from empty state

```gherkin
Given the product registry is displaying an empty state after searching for "ZZZ-NO-MATCH-999"
When the user clicks the "Clear filters" link
Then the search value is cleared
And the empty state is removed
And the default product registry rows are reloaded
```

### Scenario 6: Navigation to classification detail view after empty state recovery

```gherkin
Given the user has cleared filters and the default product registry rows are displayed
When the user locates the row for "ABCD Shampoo" and clicks the "Classify" button
Then the system opens the "ABCD Shampoo" classification detail view successfully
And the module is not in an invalid state from the previous empty search result
```

## Traceability Matrix

| Source ID | Requirement | Acceptance Criteria | Test Coverage |
|---|---|---|---|
| US AUTO-18, Step 1 | FR-1: Enable Sub-Category dropdown on Primary Category selection | Sub-Category dropdown enabled with cosmetic options when "Cosmetic" selected | Scenario 1 |
| US AUTO-18, Step 2 | FR-2: Activate Exposure & Usage Attributes for Rinse-Off | Mandatory fields displayed when "Rinse-Off" selected | Scenario 1 |
| US AUTO-18, Step 3 | FR-3: Accept Contact Time = 20 without validation errors | No inline validation errors at boundary value | Scenario 1 |
| US AUTO-18, Step 3 | FR-4: Helper rule callout remains informational | Callout is informational only at boundary values | Scenario 1 |
| US AUTO-18, Step 4 | FR-5: Regulatory Effects Preview for rinse-off | Preview shows linked frameworks and placeholders | Scenario 1 |
| US AUTO-18, Step 5 | FR-6: POST classification on Save Classification click | POST /api/products/{productId}/classification submitted | Scenario 1 |
| US AUTO-18, Step 5 | FR-7: Success state displayed after save | Success state shown, no validation errors | Scenario 1 |
| US AUTO-18, Step 5 | NFR-1: Save completes in under 1 second | Response time < 1 second | Scenario 1 |
| US AUTO-18, Step 6 | FR-8: Success toast "Classification saved successfully." | Toast message displayed | Scenario 1 |
| US AUTO-18, Step 6 | FR-9: Product status transitions to saved/classified | Status updated after save | Scenario 1 |
| US AUTO-18, Step 6 | FR-10: Classification summary shows saved values | Summary shows "Cosmetic / Rinse-Off", Contact Time = 20 min | Scenario 1 |
| US AUTO-18, Step 7 | FR-11: Audit timeline entry created | Audit entry for classification save present | Scenario 2 |
| US AUTO-18, Step 7 | FR-12: Downstream regulatory requirements generated | Requirements shown as generated/finalized | Scenario 2 |
| US AUTO-19, Step 1 | FR-13: Registry page loads with table, filter bar, search input | Page elements present and labeled correctly | Scenario 3 |
| US AUTO-19, Step 2 | FR-14: Search returns no matching rows | Table refreshes with zero results | Scenario 3 |
| US AUTO-19, Step 3 | FR-15: Well-formed empty state displayed | Empty state shown, not broken/blank table | Scenario 3 |
| US AUTO-19, Step 3 | NFR-2: Table not broken under zero results | No broken or blank rendering | Scenario 3 |
| US AUTO-19, Step 4 | FR-16: Filter controls interactive during empty state | Market filter, status filter, "Clear filters" usable | Scenario 4 |
| US AUTO-19, Step 5 | FR-17: Clear filters recovers from empty state | Search cleared, default rows reloaded | Scenario 5 |
| US AUTO-19, Step 6 | FR-18: Classify button works after empty state recovery | Classification detail view opens successfully | Scenario 6 |

## Open Questions

| ID | Question | Context |
|---|---|---|
| OQ-1 | What specific roles or permissions are required to access the Product Classification module, perform classification saves, and view the audit activity panel? | No role or permission model is defined in the source. |
| OQ-2 | What is the exact request body schema (field names, types, required/optional) for `POST /api/products/{productId}/classification`? | Source provides form field names but not the API payload schema. |
| OQ-3 | What is the HTTP status code and response body structure for a successful classification save? | Source confirms a success state but does not specify the response contract. |
| OQ-4 | What error response codes and body structures are returned for validation failures, not-found products, or server errors on the classification save endpoint? | No error contract is specified. |
| OQ-5 | What is the API endpoint, method, and query parameter structure for the product registry search? | Source describes UI behavior but does not specify the search API. |
| OQ-6 | What is the minimum allowed value for Contact Time? | Source specifies 20 as the maximum boundary but does not state the minimum. |
| OQ-7 | What are the complete lists of valid options for Application Method, Target Body Area, Exposure Duration Band, and Primary/Sub-Category? | Source provides examples but not exhaustive enumerations. |
| OQ-8 | What is the maximum length or character constraint for the Usage Notes field? | Not specified in source. |
| OQ-9 | Are there additional non-functional requirements for accessibility (WCAG level), reliability (uptime SLA), security (input sanitization, CSRF), or observability (logging, monitoring)? | Not specified in source. |
| OQ-10 | What is the empty state message copy displayed when the product registry search returns no results? | Source states an empty state is displayed but does not specify the exact message text. |
| OQ-11 | What is the lookup source for cosmetic sub-category options? Is it a static configuration, database table, or external service? | Source references "lookup source" without specifying the mechanism. |
| OQ-12 | What constitutes the "saved/classified state" for product status? Is it a specific enum value, and what are the valid status transitions? | Source references a state change but does not define the status model. |
| OQ-13 | What is the architecture style for the monolith — is the API served by the same application as the UI, or is there a separate API layer? | Source signals "monolith" architecture but does not elaborate on deployment topology. |

## Source References

| Reference Type | Identifier | Description |
|---|---|---|
| Feature ID | 1187483449 | Save rinse-off classification at max contact time boundary; Handle product registry search with no matching products |
| User Story ID | US AUTO-18 | Save rinse-off classification successfully at the maximum allowed contact time boundary of 20 minutes |
| User Story ID | US AUTO-19 | Handle product registry search returning no matching products without blocking classification workflow |
| Architecture Style | Monolith | User-selected architecture style from feature metadata |