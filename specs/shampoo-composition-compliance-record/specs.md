# Feature: ABCD Shampoo Regulatory Composition Assessment
Status: NEW
Owner: Astra
Last Updated: 2026-10-29

## Summary
- Deliver a single regulatory assessment capability for **ABCD Shampoo** that consolidates composition evidence and classification context for global compliance evaluation.
- Support ABCD Shampoo as:
  - a **rinse-off cosmetic product**
  - a **chemical mixture**
  - a **finished consumer product** with multiple target markets
  - a **formulation** with raw materials and constituent substances
- Support capture, validation, persistence, retrieval, and authorized update of required composition attributes so the assessment can be completed from one record.
- Prevent setup/submission/finalization/completion actions when required classification or composition data is missing or invalid.

## Scope
### In Scope
- Persist and retrieve the following on the ABCD Shampoo regulatory assessment record or linked composition structures:
  - `productTypeClassification = RINSE_OFF_COSMETIC_PRODUCT`
  - `mixtureClassification = CHEMICAL_MIXTURE`
  - `productClassification = FINISHED_CONSUMER_PRODUCT`
  - multiple supported market codes
  - formulation indicator
  - multiple raw materials and linked constituent substances
  - ingredient INCI names
  - substance CAS numbers
  - optional substance EC numbers
  - substance function
  - substance concentration percentages
  - impurity records at or above `0.1%`
  - finished-product nano-material presence
  - substance origin classification
- Import composition data into exactly one regulatory assessment record for ABCD Shampoo.
- Validate required fields, controlled values, duplicate handling, format rules, authorization, and no-partial-save behavior where stated.
- Display persisted values in UI and return them in retrieval responses where stated.
- Record audit metadata and import traceability where stated.

### Out of Scope
- Chemical mixture classification rules beyond storing the classification.
- Jurisdiction-specific hazard classification, inventory verification, disclosure, approval determination, toxicological assessment, or threshold decisioning unless explicitly stated as validation.
- Bulk import across multiple products.
- External spreadsheet/master-data/supplier/system import variants not defined in source.
- Automatic synonym resolution, external registry verification, lookup, enrichment, or derivation for identifiers.
- Historical migration/version comparison.
- Editing imported composition values in the assessment screen.
- Per-substance nano-material details, particle size, or attachments.
- Advanced customization/future stories.

## Application Type & Platform Context
- **Type:** Mixed web UI + API/service.
- **Evidence:**
  - Users open setup/composition/import screens and forms.
  - Client sends selected codes to classification API.
  - Source explicitly references save endpoints, retrieval payloads, authorization errors, and UI validation/success states.
- **Architecture style:** monolith.
- **Open Question:** Whether import is file upload only, payload only, or both in the first release.

## Actors and Permissions
- **Regulatory Assessor**
  - Can save/update classification data when authenticated and holding regulatory assessment edit permission.
  - Can document impurities and nano-material presence with appropriate edit permission.
  - Can view compositional breakdown when authorized for the selected assessment record.
- **Global Compliance Manager**
  - Can create/update finished consumer product classification and target markets when holding compliance edit authorization.
- **Formulation Specialist**
  - Can create/update formulation, raw materials, substance links, and concentration percentages when holding formulation edit permission.
- **Regulatory Data Steward**
  - Can create/update INCI names, CAS numbers, EC numbers, and substance origin when holding regulatory composition/substance maintenance permission.
- **Compliance Analyst**
  - Can import composition data when authorized compliance access exists.
- **View-only users**
  - May view records if role permits, but cannot perform create/update actions where source states write access restrictions.
- Unauthorized writes must return an authorization error / `403` where stated and must not alter stored data.

## Feature Development Intent
- Build end-to-end feature behavior for a single ABCD Shampoo regulatory assessment record that:
  - captures required classifications and composition evidence,
  - preserves concurrent classifications without destructive overwrite,
  - blocks incomplete completion/finalization/submission actions,
  - supports import into one authoritative record,
  - exposes saved values through UI and retrieval responses,
  - enforces auditability and authorization.

## UI Design & Interaction Contract
- Source-supported UI areas:
  - regulatory assessment setup screen
  - product regulatory classification feature/view
  - finished product ingredient section
  - substance documentation section
  - composition detail / composition form / product composition screen
  - formulation editing mode
  - impurity documentation section
  - assessment import screen
  - regulatory assessment view / compliance or audit view
- UI behavior:
  - Reopen of the same record must display previously saved values without re-entry where stated.
  - Save success must show a success confirmation/state where stated.
  - Missing required values must block save, completion, finalization, or submission as specified.
  - Validation must be targeted:
    - row-level for invalid INCI, CAS, concentration
    - field-level for invalid/omitted EC, nano-material presence where applicable
    - precise incomplete raw material identification on submission block
    - specific substance/import row validation messages where malformed data exists
  - Nano-material presence field:
    - required
    - exactly two selectable values: **Yes** and **No**
  - Origin classification UI:
    - exactly one value per substance from **Synthetic**, **Natural**, **Botanical**
- Accessibility expectations:
  - Not explicitly defined.
- **Open Questions**
  - Exact screen layouts, control types beyond stated selections/rows, inline vs summary error placement, and confirmation copy text.
  - Whether substance function is row-level inline editing, modal, or detail page.
  - Whether market selection UI is multi-select, checklist, or tokenized input.

## API Contract
- API/service behavior is required but exact endpoint details are not provided.
- Supported write/read capabilities implied by source:
  - save/update product type classification by assessment identifier
  - save/update mixture classification by assessment identifier
  - save/update finished product classification and target markets
  - save/update formulation, raw materials, and substance links
  - save/update ingredient list with INCI names
  - save/update substance identifiers and attributes (CAS, optional EC, function, origin, concentration)
  - save/update impurity records
  - save/update nano-material presence
  - import composition data into one assessment record
  - retrieve consolidated assessment/composition data
- Contract rules:
  - Requests requiring an assessment/product/record identifier must reject invalid or missing identifiers.
  - Unsupported classification/origin/market values must be rejected.
  - Duplicate raw material identifiers in one formulation payload must be rejected.
  - Duplicate substance identifiers within the same raw material context must be rejected.
  - Duplicate market codes in one request must be rejected.
  - Duplicate/invalid import structure must be rejected when stated; no partial persistence.
  - Unauthorized mutation must return authorization error / `403` where stated.
  - Retrieval for dual-classified records must return both stored classifications.
  - Retrieval of substance data must include optional EC number when present.
  - Retrieval of saved records must include persisted values exactly as stored after trimming where stated.
- Transactionality / idempotency expectations from source:
  - No partial record creation on invalid classification save.
  - No partial save for invalid market associations.
  - No partial structure save for invalid formulation payload.
  - No partial composition persistence for malformed import.
  - Existing unrelated classifications must remain unchanged when updating another classification.
- **Open Questions**
  - Exact endpoints, HTTP methods, payload schemas, response schemas, error schema, import transport format, and whether updates are partial or full-resource semantics.

## Business Logic & Rules
- ABCD Shampoo must support concurrent classification on the same record as:
  - rinse-off cosmetic product
  - chemical mixture
  - finished consumer product
  - formulation
- Setup completion rule:
  - setup completion must be rejected if rinse-off cosmetic product classification is not stored.
- Mixture coexistence rule:
  - saving `CHEMICAL_MIXTURE` must preserve existing `RINSE_OFF_COSMETIC_PRODUCT`.
  - updating mixture classification must not null/replace unrelated required classifications.
- Finished product + markets:
  - saving finished consumer product requires at least one supported market.
  - saved market list must contain each selected market exactly once.
  - unsupported or duplicate market codes reject the request with no partial save.
- Formulation:
  - formulation record stores a formulation indicator.
  - multiple raw materials are required for this modeled formulation scenario.
  - each raw material can link to one or more constituent substances.
  - final assessment submission must be blocked if any raw material lacks constituent substance detail.
- INCI:
  - every ingredient row requires an INCI name.
  - null/empty/whitespace-only INCI names are invalid.
  - leading/trailing spaces are trimmed on save.
  - at least one ingredient row is required before marking the section complete.
- CAS:
  - every substance row requires a CAS number before section completion.
  - CAS must be non-null, non-empty, non-whitespace, and match valid numeric-hyphen CAS format.
  - leading/trailing spaces are trimmed before validation/persistence.
- EC:
  - EC number is optional.
  - blank/null/omitted EC is allowed and must not create placeholder/default values.
  - when provided, EC must match configured format.
- Substance function:
  - function must be captured for each substance.
  - finalization of a substance entry must be prevented when function is missing.
- Concentration:
  - `concentrationPercent` required per substance row in scope of this story.
  - must be numeric and between `0` and `100` inclusive.
- Impurities:
  - impurity record must include identity data and `impurityPercent`.
  - record is saveable in this workflow only when `impurityPercent >= 0.1`.
  - impurity data must be distinguishable from standard substance composition data.
- Nano-material presence:
  - required finished-product-level field.
  - allowed values are exactly Yes/No (or controlled equivalent mapped to those values).
- Substance origin:
  - exactly one value per substance.
  - allowed values only: `SYNTHETIC`, `NATURAL`, `BOTANICAL` (displayed as Synthetic, Natural, Botanical).
- Import:
  - valid ABCD Shampoo product identifier is required.
  - one import transaction creates or updates exactly one regulatory assessment record.
  - malformed structure or missing required composition rows/fields rejects the import with validation errors and no partial save.
  - imported required attributes include:
    - INCI name
    - CAS number
    - EC number where applicable
    - concentration percentage
    - substance function
    - impurity information
    - nano-material presence
    - substance origin
  - each imported attribute must map to the correct substance entry.
  - constituent parent-child composition relationships must be preserved.
- Audit/traceability:
  - create/update of rinse-off cosmetic classification stores acting user and timestamp.
  - import stores association among ABCD Shampoo, submitting authenticated user, and source import request/file identifier.
  - source also calls for audit entries on create/update actions for composition/market changes where stated.

## Data Model & Validation
### Source-supported entities / attributes
- Regulatory assessment record / assessmentId / assessmentRecordId
- Product / productId / productCode / valid ABCD Shampoo product identifier
- `productTypeClassification`
- `mixtureClassification`
- `productClassification`
- `targetMarkets[]` / marketCode
- formulation indicator
- raw material entry / raw material identifier
- constituent substance record / substanceId / substance identifier
- ingredient row / ingredient row identifier / `inciName`
- substance `casNumber`
- substance optional `ecNumber`
- substance function
- substance `concentrationPercent`
- impurity identity data (`impurityName` or `impuritySubstanceId`) and `impurityPercent`
- `nanoMaterialPresence`
- `substanceOrigin`
- audit metadata:
  - `createdBy`
  - `createdAt`
  - `updatedBy`
  - `updatedAt`
- import metadata:
  - source import request or file identifier
  - imported row count
  - submission/import timestamp

### Validation rules
- Non-null valid assessment/product/record identifier where required.
- Controlled classification codes only.
- Supported market codes only; duplicates prohibited.
- Duplicate raw material identifiers within one formulation payload prohibited.
- Duplicate substance identifiers within one raw material context prohibited.
- `inciName`: required, trimmed, not blank.
- `casNumber`: required, trimmed, valid CAS numeric-hyphen format.
- `ecNumber`: optional; if supplied, must match configured EC format.
- `concentrationPercent`: numeric, `0..100`.
- `impurityPercent`: numeric, `>= 0.1`.
- `nanoMaterialPresence`: required; Yes/No only.
- `substanceOrigin`: one of `SYNTHETIC | NATURAL | BOTANICAL`.
- Missing required import rows/fields must fail validation.
- No partial persistence on rejected saves/imports where specified.
- **Open Questions**
  - Exact CAS and EC regex/patterns.
  - Whether substance function has a controlled vocabulary or free text.
  - Whether concentration supports ranges in editable model or only on imported view.
  - Exact duplicate impurity handling behavior; source says it should be handled consistently but does not define reject vs merge vs allow.

## Functional Requirements
1. [FR1] The system shall persist `productTypeClassification = RINSE_OFF_COSMETIC_PRODUCT` on the associated ABCD Shampoo regulatory assessment record when saved by an authenticated authorized user.
2. [FR2] The system shall reject assessment setup completion when no rinse-off cosmetic product classification is stored and shall return a validation message identifying the missing classification.
3. [FR3] The system shall display the persisted rinse-off cosmetic product classification when the same assessment is reopened.
4. [FR4] The system shall record audit metadata for each create/update of the rinse-off cosmetic product classification.
5. [FR5] The system shall reject unsupported product type values or requests without a valid assessment identifier and shall not create a partial record.
6. [FR6] The system shall persist `mixtureClassification = CHEMICAL_MIXTURE` on the associated assessment record.
7. [FR7] The system shall preserve an existing rinse-off cosmetic product classification when saving chemical mixture classification to the same record.
8. [FR8] The system shall return both stored classifications on retrieval when both exist.
9. [FR9] The system shall prevent mixture classification updates from nulling, replacing, or overwriting unrelated required classification fields.
10. [FR10] The system shall reject unsupported mixture classification values or invalid assessment identifiers and leave existing classifications unchanged.
11. [FR11] The system shall persist `productClassification = FINISHED_CONSUMER_PRODUCT` and return it on retrieval.
12. [FR12] The system shall allow association of multiple distinct supported market codes to the same assessment record.
13. [FR13] The system shall require at least one target market when saving finished consumer product market context.
14. [FR14] The system shall reject unsupported or duplicate market codes with no partial save of the record or market associations.
15. [FR15] The system shall allow authorized viewers to view the record and shall reject unauthorized write attempts for finished-product classification/market updates.
16. [FR16] The system shall store a formulation indicator and multiple raw material entries under the same product record when saved as a formulation.
17. [FR17] The system shall persist parent-child associations between each raw material and one or more constituent substances and return those same associations on retrieval.
18. [FR18] The system shall prevent final assessment submission when any raw material has no constituent substance detail and shall identify the incomplete raw material entry.
19. [FR19] The system shall reject duplicate raw material identifiers within one formulation payload or duplicate substance identifiers within the same raw material context with no partial structure save.
20. [FR20] The system shall reject unauthorized create/update/delete of raw materials or substance links.
21. [FR21] The system shall require an INCI name on every ingredient row before the ingredient section can be saved as complete.
22. [FR22] The system shall reject null, empty, or whitespace-only INCI names and show a row-level validation error for the specific row.
23. [FR23] The system shall persist the full ingredient list with each ingredient's INCI name to the correct single regulatory assessment record.
24. [FR24] The system shall trim leading/trailing spaces from INCI names on save and display persisted values on reopen.
25. [FR25] The system shall reject unauthorized create/update of INCI-based ingredient entries.
26. [FR26] The system shall require a CAS number on every substance row before the substance documentation section can be marked complete.
27. [FR27] The system shall reject null, empty, whitespace-only, or invalid-format CAS numbers with a row-specific validation error.
28. [FR28] The system shall persist each valid CAS number with its associated substance entry and display it on reopen after trimming.
29. [FR29] The system shall reject unauthorized create/update of CAS numbers.
30. [FR30] The system shall expose an optional `ecNumber` field on substance create/update flows.
31. [FR31] The system shall allow blank, null, or omitted `ecNumber` without validation error and without storing a default placeholder.
32. [FR32] The system shall validate submitted `ecNumber` values against the configured format and reject invalid values with a field-level error.
33. [FR33] The system shall persist a valid `ecNumber` only on the targeted substance and return it on later retrieval.
34. [FR34] The system shall reject unauthorized create/update of `ecNumber`.
35. [FR35] The system shall capture the function of each substance.
36. [FR36] The system shall prevent finalization of a substance entry when the function is not documented.
37. [FR37] The system shall preserve substance function values in the regulatory assessment record alongside other identifiers.
38. [FR38] The system shall validate required inputs before completing substance function documentation.
39. [FR39] The system shall allow authorized users to create/update `concentrationPercent` for each substance row associated with a selected product composition record.
40. [FR40] The system shall reject blank, non-numeric, negative, or greater-than-100 concentration entries and show the validation error on the same substance row.
41. [FR41] The system shall persist each valid `concentrationPercent` with its corresponding product and substance and return it unchanged on retrieval.
42. [FR42] The system shall display saved concentration percentages in the final regulatory assessment record generated from that product composition.
43. [FR43] The system shall reject unauthorized modification of concentration percentages.
44. [FR44] The system shall allow authorized users to create/update impurity records using impurity identity data and `impurityPercent`.
45. [FR45] The system shall save impurity records in this workflow only when `impurityPercent` is numeric and `>= 0.1`.
46. [FR46] The system shall reject impurity percentages below `0.1` with a specific validation error.
47. [FR47] The system shall store qualifying impurity entries as records distinguishable from standard substance composition information and return that designation on retrieval.
48. [FR48] The system shall make saved impurity records available in compliance evaluation and audit review outputs for the related product record.
49. [FR49] The system shall reject unauthorized create/update of impurity records.
50. [FR50] The system shall display a required nano-material presence field with exactly two selectable values: Yes and No.
51. [FR51] The system shall persist the nano-material presence value to the correct finished product record and return it on subsequent retrieval.
52. [FR52] The system shall block save/submission when nano-material presence is unselected and shall not change existing stored data.
53. [FR53] The system shall include the saved nano-material presence value in the same regulatory assessment record.
54. [FR54] The system shall reject unauthorized nano-material presence updates.
55. [FR55] The system shall allow exactly one substance origin classification per substance from Synthetic, Natural, or Botanical.
56. [FR56] The system shall persist a valid origin classification to the specific substance and return the same value on retrieval.
57. [FR57] The system shall reject origin values outside the allowed set and shall not update the substance record.
58. [FR58] The system shall make the saved origin classification available in assessment record substance attribute data.
59. [FR59] The system shall reject unauthorized origin create/update attempts.
60. [FR60] The system shall accept composition import for ABCD Shampoo only when associated with a valid ABCD Shampoo product identifier.
61. [FR61] The system shall create or update exactly one regulatory assessment record per successful import transaction and shall not create additional assessment records for that import.
62. [FR62] The system shall reject malformed composition structure or missing required composition rows/fields with field-level validation errors and store no partial composition data.
63. [FR63] The system shall, after successful import, display imported composition entries and import summary details including assessment record identifier, imported row count, and submission timestamp.
64. [FR64] The system shall store an auditable association between ABCD Shampoo, the submitting authenticated user, and the source import request/file identifier for each successful import.
65. [FR65] The system shall require imported composition data to include INCI name, CAS number, EC number where applicable, concentration percentage, substance function, impurity information, nano-material presence, and substance origin.
66. [FR66] The system shall identify missing required import fields before the regulatory assessment record is accepted for compliance evaluation.
67. [FR67] The system shall map each imported attribute to the correct substance entry in the single assessment record.
68. [FR68] The system shall persist every imported substance composition entry linked to the single assessment record and make it retrievable in the regulatory assessment view.
69. [FR69] The system shall display the full compositional breakdown for each imported substance, including substance name, identifier when provided, and concentration value or range from the saved record.
70. [FR70] The system shall preserve and display constituent-level parent-child composition relationships under the correct substance when present in import data.
71. [FR71] The system shall flag affected substance entries with specific validation messages when required composition fields are missing or malformed during import and shall not silently discard the issue.
72. [FR72] The system shall allow only authenticated users with access to the selected assessment record to view the compositional breakdown.

## Non-Functional Requirements
- **Performance**
  - Multi-market save/reload should complete within normal form response thresholds.
  - Composition-related save/retrieval should support interactive form editing without noticeable lag for normal ABCD Shampoo record sizes.
  - Save and retrieval for multi-market context should complete within **2 seconds** for standard market counts.
  - Formulation save/retrieval should complete within **2 seconds** for standard component volumes.
  - Composition evidence view should load within **2 seconds** for expected record size.
  - Retrieval should avoid extra page latency and include related data in primary/batched responses where stated.
- **Reliability / Data Integrity**
  - Reject invalid requests without partial writes where source specifies.
  - Existing unrelated data must remain unchanged on invalid or unauthorized update attempts.
  - Import must use transactional persistence sufficient to avoid partial writes.
- **Security**
  - Authenticated access required for writes.
  - Role/permission-based authorization required for edit and record access.
  - Unauthorized mutation attempts return `403` where specified.
  - Prevent cross-record updates by verifying record ownership or access scope where stated.
- **Observability**
  - Structured logs/metrics for save success, validation failures, setup/submission blocks, import processing, authorization denials, retrieval failures, and mapping errors.
  - Logged identifiers may include assessmentRecordId/productId/substanceId/requestId/userId/market list/outcome where stated.
  - Audit entries required for classification changes and import traceability; additional create/update audit events where source states.
- **Accessibility**
  - No explicit accessibility standard provided.
- **Compliance/Retention**
  - Audit-ready compliance record/history is required.
  - **Open Question:** retention period and audit history immutability requirements are not specified.

## Acceptance Scenarios
### 1. Save rinse-off cosmetic product classification
**Given** an authenticated Regulatory Assessor with edit permission  
**When** ABCD Shampoo is saved with `productTypeClassification = RINSE_OFF_COSMETIC_PRODUCT`  
**Then** the system persists that exact value on the associated regulatory assessment record  
**And** stores acting user and timestamp in compliance record history  
**And** reopening the record displays the stored classification.

### 2. Block setup completion when rinse-off classification is missing
**Given** an ABCD Shampoo assessment record without stored rinse-off cosmetic classification  
**When** the user attempts to complete assessment setup  
**Then** the system rejects the completion action  
**And** returns a validation message identifying the missing classification.

### 3. Save chemical mixture without overwriting product type classification
**Given** an ABCD Shampoo assessment record already classified as `RINSE_OFF_COSMETIC_PRODUCT`  
**When** an authenticated authorized user saves `mixtureClassification = CHEMICAL_MIXTURE`  
**Then** the system stores the mixture classification  
**And** preserves the existing product type classification  
**And** retrieval returns both classifications.

### 4. Reject invalid market submission
**Given** a Global Compliance Manager editing finished-product market context  
**When** the submitted request contains no market, an unsupported market code, or a duplicate market code  
**Then** the system rejects the request with a validation message  
**And** does not partially save the record or market associations.

### 5. Save finished consumer product with multiple markets
**Given** an authorized Global Compliance Manager  
**When** ABCD Shampoo is saved with `productClassification = FINISHED_CONSUMER_PRODUCT` and multiple distinct supported market codes  
**Then** the system persists the classification and each selected market exactly once  
**And** retrieval returns the same classification and market list.

### 6. Prevent final submission for incomplete formulation
**Given** a formulation for ABCD Shampoo containing multiple raw materials  
**And** at least one raw material has no constituent substance detail  
**When** the user attempts final assessment submission  
**Then** the system blocks submission  
**And** identifies the incomplete raw material entry  
**And** does not partially finalize the assessment.

### 7. Reject duplicate formulation identifiers
**Given** an authorized Formulation Specialist  
**When** a formulation payload contains duplicate raw material identifiers or duplicate substance identifiers within the same raw material  
**Then** the system rejects the request  
**And** saves no partial formulation structure.

### 8. Validate INCI row requirements
**Given** a finished product ingredient section with multiple ingredient rows  
**When** any row has a null, empty, or whitespace-only INCI name  
**Then** the system rejects completion/save of that section  
**And** displays a row-level validation error for the affected row  
**And** persists no invalid row.

### 9. Validate CAS format
**Given** a substance documentation section  
**When** a user enters a CAS number that is blank, whitespace-only, or not in valid numeric-hyphen format  
**Then** the system rejects the row  
**And** returns a row-specific validation error  
**And** does not mark the section complete.

### 10. Allow blank EC number but reject invalid format
**Given** an authorized Regulatory Data Steward editing a substance  
**When** `ecNumber` is blank, null, or omitted  
**Then** the system allows the save without a validation error and does not populate a placeholder  
**When** an invalid EC number format is submitted  
**Then** the system rejects the value with a field-level error.

### 11. Require substance function before finalization
**Given** a substance entry without a documented function  
**When** the user attempts to finalize that substance entry  
**Then** the system prevents finalization  
**And** validates the missing required input.

### 12. Validate concentration percentage
**Given** a composition record with substance rows  
**When** a concentration value is blank, non-numeric, less than `0`, or greater than `100`  
**Then** the system rejects the value  
**And** displays the validation error on the same substance row  
**And** leaves stored data unchanged.

### 13. Save reportable impurity
**Given** an authenticated Regulatory Assessor with edit permission  
**When** the user submits impurity identity data with `impurityPercent >= 0.1`  
**Then** the system saves a distinguishable impurity record linked to the product  
**And** makes it available in compliance evaluation and audit review outputs.

### 14. Reject impurity below threshold
**Given** an impurity submission for ABCD Shampoo  
**When** `impurityPercent < 0.1`  
**Then** the system rejects the request with a specific validation error  
**And** does not save the impurity record.

### 15. Require nano-material presence
**Given** the finished product composition form  
**When** nano-material presence is left unselected during save  
**Then** the system blocks submission  
**And** shows a field-level validation error  
**And** does not change existing stored data.

### 16. Save valid substance origin
**Given** a substance record  
**When** the user selects exactly one allowed origin value from Synthetic, Natural, or Botanical and saves  
**Then** the system persists the value to that specific substance  
**And** returns the same value on retrieval.

### 17. Reject invalid substance origin
**Given** a substance update request  
**When** the request contains an origin outside the allowed set  
**Then** the system rejects the request with a validation error  
**And** does not update the substance record.

### 18. Successful import to one assessment record
**Given** an authorized Compliance Analyst with valid ABCD Shampoo composition data and a valid ABCD Shampoo product identifier  
**When** the user imports the data  
**Then** the system creates or updates exactly one regulatory assessment record for that transaction  
**And** stores no additional assessment records  
**And** displays imported entries plus assessment record identifier, imported row count, and submission timestamp.

### 19. Reject malformed import without partial persistence
**Given** a composition import request with malformed structure or missing required rows/fields  
**When** the import is submitted  
**Then** the system returns field-level validation errors for affected entries  
**And** stores no partial composition data in the regulatory assessment record.

### 20. View full compositional breakdown from imported record
**Given** an authenticated user authorized to access a selected imported assessment record  
**When** the user opens the regulatory assessment view  
**Then** the system displays every persisted substance composition entry linked to that record  
**And** shows substance name, identifier when provided, concentration value or range  
**And** preserves any constituent parent-child relationships under the correct substance.

## Traceability Matrix
| Source ID | Requirement | Acceptance Criteria | Test Coverage |
|---|---|---|---|
| US 64951 | FR-1 to FR-5 | Persist rinse-off classification, block setup completion, reload display, audit metadata, reject invalid values/assessmentId | Unit, API, UI, audit |
| US 64957 | FR-6 to FR-10 | Persist mixture classification, preserve product type, retrieve both, non-destructive updates, reject invalid requests | Unit, API, integration |
| US 64963 | FR-11 to FR-15 | Persist finished product classification, allow multiple distinct markets, require markets, reject unsupported/duplicate markets, enforce write authorization | API, UI, auth, integration |
| US 64969 | FR-16 to FR-20 | Save formulation indicator + multiple raw materials, persist parent-child links, block final submission for missing constituent detail, reject duplicates, enforce auth | API, UI, integration |
| US 64975 | FR-21 to FR-25 | Require INCI per row, reject blank INCI with row error, persist full ingredient list, trim and reload exact values, enforce auth | UI, API, validation |
| US 64981 | FR-26 to FR-29 | Require CAS, validate CAS format, persist per substance, enforce auth | UI, API, validation |
| US 64987 | FR-30 to FR-34 | Optional EC field, allow blank, validate format when supplied, persist on targeted substance, enforce auth | UI, API, validation |
| US 64993 | FR-35 to FR-38 | Capture substance function, prevent finalization when missing, preserve value, validate inputs | UI, API, integration |
| US 64999 | FR-39 to FR-43 | Allow concentration update, reject invalid ranges/formats, persist unchanged on retrieval, display in final assessment record, enforce auth | UI, API, integration |
| US 65005 | FR-44 to FR-49 | Allow impurity records, require numeric >=0.1, distinguish from standard substance data, expose in compliance/audit outputs, enforce auth | API, UI, integration |
| US 65011 | FR-50 to FR-54 | Required Yes/No nano-material field, persist and retrieve, block unselected save, include in assessment record, enforce auth | UI, API, integration |
| US 65017 | FR-55 to FR-59 | Exactly one allowed origin value, persist and retrieve, reject unsupported values, expose in assessment data, enforce auth | UI, API, validation |
| US 65023 | FR-60 to FR-64 | Import valid data to exactly one assessment record, reject invalid product id, reject malformed import with no partial save, show import summary, store traceability | API, UI, integration |
| US 65029 | FR-65 to FR-67 | Require imported attributes, identify missing required import fields, map attributes to correct substance entry | Import validation, mapping tests |
| US 65035 | FR-68 to FR-72 | Persist/retrieve all imported substance composition entries, display full breakdown, preserve parent-child relationships, show specific validation issues, enforce record access | Integration, UI, auth, performance |

## Open Questions
- What exact API endpoints, methods, payload schemas, response schemas, and error payload formats should be used?
- What is the authoritative list of:
  - supported market codes
  - supported product type / mixture classification codes beyond those named here
  - configured EC number format
- What exact CAS validation pattern should be enforced?
- Is substance function a free-text field or controlled vocabulary?
- For substance origin, should API accept display values, canonical uppercase enum values, or both?
- Are finished product classification, rinse-off cosmetic classification, and formulation indicator separate fields, separate facets, or part of one normalized classification model?
- What exact assessment lifecycle states correspond to:
  - setup completion
  - section complete
  - finalization of a substance entry
  - final assessment submission
- What exact UI should be used for:
  - import summary display
  - compositional breakdown expansion
  - targeted incomplete raw material error messaging
- Should duplicate impurity records for the same product/identity be rejected, merged, or versioned?
- Is nano-material presence stored at assessment level, product composition level, or both with mapping?
- Are concentration ranges editable anywhere, or only displayed when present in imported data?
- For import, what file types/content types/size limits are supported?
- Are non-blocking import warnings required in the first release, and if so, what warning categories exist?
- What retention/history rules apply to audit metadata and import traceability records?
- What role matrix governs read access across the actors beyond the explicitly stated write permissions?

## Source References
- Feature ID: 64917
- Feature Reference: 64917
- Feature Title: ABCD Shampoo Regulatory Composition Assessment
- User Stories:
  - US 64951
  - US 64957
  - US 64963
  - US 64969
  - US 64975
  - US 64981
  - US 64987
  - US 64993
  - US 64999
  - US 65005
  - US 65011
  - US 65017
  - US 65023
  - US 65029
  - US 65035
- Golden Repo file paths used:
  - None provided in source context.