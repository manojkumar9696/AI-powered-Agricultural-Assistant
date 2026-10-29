# Implementation Requirements Checklist

**Purpose**: Provide an implementation acceptance checklist that agents can execute one item at a time.  
**Feature**: ABCD Shampoo Regulatory Composition Assessment

## Functional Acceptance Criteria

- [ ] [R1] Persist `productTypeClassification = RINSE_OFF_COSMETIC_PRODUCT` on the ABCD Shampoo regulatory assessment record; reload shows the saved value without re-entry
- [ ] [R2] Block assessment setup completion when rinse-off cosmetic product classification is missing; return a targeted validation message
- [ ] [R3] Record audit metadata for product type classification create/update, including acting user and timestamp
- [ ] [R4] Reject unsupported product type values or missing/invalid assessment identifiers with no partial product type record saved
- [ ] [R5] Persist `mixtureClassification = CHEMICAL_MIXTURE` on the same assessment record without overwriting existing product type classification
- [ ] [R6] Assessment retrieval returns both product type and mixture classifications together when both are saved
- [ ] [R7] Mixture classification updates leave unrelated required classification fields unchanged; invalid values or assessment identifiers are rejected with no data change
- [ ] [R8] Persist `productClassification = FINISHED_CONSUMER_PRODUCT` and associate multiple distinct supported market codes on the same assessment record
- [ ] [R9] Block finished-product save when no market is selected; reject unsupported or duplicate market codes with no partial save of classification or market associations
- [ ] [R10] Enforce authorization so permitted viewers may read, but only authorized editors may create/update finished-product classification and market selections
- [ ] [R11] Persist formulation indicator and multiple raw materials under the same product/assessment record
- [ ] [R12] Persist one-or-more constituent substances per raw material and return the same parent-child associations on retrieval
- [ ] [R13] Block final assessment submission when any raw material lacks constituent substance detail; identify the incomplete raw material in the error response/UI
- [ ] [R14] Reject duplicate raw material identifiers within one formulation payload and duplicate substance identifiers within the same raw material context; save nothing partially
- [ ] [R15] Require an INCI name on every ingredient row before the finished product ingredient section can be saved complete
- [ ] [R16] Reject null, empty, or whitespace-only INCI names with row-level validation; trim leading/trailing spaces before persistence and display
- [ ] [R17] Persist and reload the full ingredient list with INCI names on the correct single regulatory assessment record; unauthorized updates do not alter data
- [ ] [R18] Require a CAS number on every substance row before substance documentation can be marked complete
- [ ] [R19] Reject null, empty, whitespace-only, or invalid-format CAS numbers with row-specific validation; trim surrounding spaces before validation/persistence
- [ ] [R20] Persist CAS numbers with the correct substance entries and reload them unchanged on the same assessment record; unauthorized updates do not alter data
- [ ] [R21] Expose optional `ecNumber` on substance create/update; blank/null/omitted values save without placeholder defaults or validation errors
- [ ] [R22] Validate submitted EC numbers against the configured format; persist valid values only on the targeted substance and return them on retrieval
- [ ] [R23] Capture a required substance function for each substance entry; block completion/finalization when function is missing and persist/retrieve the saved value
- [ ] [R24] Allow authorized create/update of `concentrationPercent` for each substance row; reject blank, non-numeric, negative, or `>100` values with same-row validation
- [ ] [R25] Persist concentration percentages with `productId` and `substanceId`, and display the saved values in the final regulatory assessment record
- [ ] [R26] Allow authorized creation/update of impurity records using identity data plus `impurityPercent`; save only when numeric and `>= 0.1`
- [ ] [R27] Reject impurity values below `0.1` with a specific validation error; store qualifying impurities as records distinguishable from standard substance composition and include them in compliance/audit outputs
- [ ] [R28] Provide a required nano-material presence field with exactly `Yes` and `No`; block save when unselected and preserve existing stored data on validation failure
- [ ] [R29] Persist nano-material presence to the correct finished product/assessment record and include it in the single regulatory assessment record retrieval/output
- [ ] [R30] Persist exactly one substance origin classification per substance from the controlled set `SYNTHETIC | NATURAL | BOTANICAL`
- [ ] [R31] Reject unsupported substance origin values without updating the record; include saved origin in assessment substance attribute data
- [ ] [R32] Support composition import that creates or updates exactly one regulatory assessment record for ABCD Shampoo per import transaction
- [ ] [R33] Reject import when the product identifier is not a valid ABCD Shampoo identifier; reject malformed composition structure or missing required rows with field-level errors and no partial persistence
- [ ] [R34] After successful import, display imported composition entries plus import summary details including assessment record identifier, imported row count, and submission timestamp
- [ ] [R35] Persist auditable linkage between ABCD Shampoo, submitting authenticated user, and source import request/file identifier
- [ ] [R36] Ensure imported records include required substance attributes: INCI name, CAS number, EC number where applicable, concentration percentage, substance function, impurity information, nano-material presence, and substance origin
- [ ] [R37] Detect missing required import fields before the assessment record is accepted for compliance evaluation and map each imported attribute to the correct substance entry
- [ ] [R38] Persist every imported substance composition entry linked to the saved single assessment record and make it retrievable in the regulatory assessment view
- [ ] [R39] Display full compositional breakdown per imported substance, including substance name, identifier when provided, concentration value/range, and preserved constituent parent-child relationships
- [ ] [R40] Flag missing or malformed required composition fields with specific validation messages and never silently discard affected issues
- [ ] [R41] Enforce record-level access so only authenticated users authorized for the selected assessment record can view composition breakdown data

## UI Acceptance Criteria

- [ ] [R42] Assessment setup UI shows and reloads saved classification values for product type, mixture classification, finished-product classification, and target markets
- [ ] [R43] UI presents targeted validation messages for missing rinse-off cosmetic classification, missing target markets, invalid classification values, and invalid assessment identifiers where source-supported
- [ ] [R44] Formulation editing UI supports multiple raw material rows and nested substance rows with preserved parent-child associations on reload
- [ ] [R45] Final submission UI identifies specific raw materials missing constituent substance detail
- [ ] [R46] Ingredient UI provides row-level INCI validation and displays trimmed persisted INCI values on reopen
- [ ] [R47] Substance UI provides row-level CAS validation, optional EC number input, required substance function input, origin selection, and concentration percentage input where applicable
- [ ] [R48] Impurity UI distinguishes impurity records from standard composition rows and surfaces threshold validation errors clearly
- [ ] [R49] Finished product composition UI shows a required nano-material presence control with exactly two selectable options: Yes and No
- [ ] [R50] Import UI presents field-level validation errors and a success summary with record identifier, imported row count, and submission timestamp
- [ ] [R51] Assessment composition view displays full imported compositional breakdown, nested constituent details, and any mapping/validation anomalies
- [ ] [R52] Existing accessibility, responsive behavior, and local UI conventions are preserved for form editing, validation, and record review flows

## API and Integration Acceptance Criteria

- [ ] [R53] Classification save/read operations accept valid assessment identifiers, reject unsupported codes, and avoid creating partial records on failure
- [ ] [R54] Classification APIs support coexistence of product type, mixture, and finished-product context on the same assessment record without destructive updates
- [ ] [R55] Market association APIs enforce distinct supported market codes and transactional save behavior for classification plus market associations
- [ ] [R56] Formulation APIs persist raw materials and constituent substances transactionally and reject duplicate identifiers within the specified scopes
- [ ] [R57] Ingredient, substance, impurity, nano-material, and origin APIs validate payloads server-side and return row/field-specific errors where source-supported
- [ ] [R58] Import API or upload workflow validates product identity, structure, required rows, and single-record creation/update behavior per import transaction
- [ ] [R59] Retrieval APIs return combined classification, market, ingredient, substance attribute, impurity, formulation, and imported composition data required by the assessment views
- [ ] [R60] Write operations enforce authentication and role/permission checks for regulatory assessment edit, compliance edit, formulation edit, substance maintenance, and composition maintenance actions
- [ ] [R61] Authorization failures return an access/authorization error without changing stored data
- [ ] [R62] Existing contracts remain backward-compatible unless a source-supported change is explicitly required

## Business Logic and Data Acceptance Criteria

- [ ] [R63] The single regulatory assessment record consolidates ABCD Shampoo classification, market context, formulation structure, ingredient data, substance identifiers/attributes, impurity data, and imported composition evidence where source-supported
- [ ] [R64] Classification persistence preserves unrelated required fields and supports concurrent storage of multiple classification dimensions on one record
- [ ] [R65] Market associations store each selected supported market exactly once
- [ ] [R66] Formulation persistence uses stable parent-child links between assessment/product, raw materials, and constituent substances
- [ ] [R67] Ingredient rows persist canonical trimmed `inciName` values and require at least one ingredient row before the section is complete
- [ ] [R68] Substance rows persist canonical trimmed `casNumber` values in valid CAS numeric-hyphen format
- [ ] [R69] EC number remains optional and does not default when omitted
- [ ] [R70] Substance function is required before substance entry completion/finalization
- [ ] [R71] `concentrationPercent` persists with consistent numeric precision and allowed range `0..100`
- [ ] [R72] Impurity records remain distinguishable from standard substance composition records and enforce the reportable threshold `>= 0.1`
- [ ] [R73] Nano-material presence persists as a required controlled value and is mapped into the single regulatory assessment record
- [ ] [R74] Substance origin persists as exactly one controlled value per substance from the supported set
- [ ] [R75] Import processing stores no partial composition data when validation fails and preserves imported parent-child composition structure when valid
- [ ] [R76] Imported required substance attributes map to the correct substance entry in the single assessment record
- [ ] [R77] Audit history/persistence captures required actor and timestamp metadata for applicable create/update/import actions

## Non-Functional Acceptance Criteria

- [ ] [R78] Authentication and permission enforcement cover all write paths and protected read paths described in the user stories
- [ ] [R79] Structured logging and metrics are emitted for save success, validation failures, setup/submission blocks, import outcomes, overwrite-prevention checks, and authorization denials where source-supported
- [ ] [R80] Auditability is preserved for classification changes, market/context updates, ingredient/substance changes, impurity updates, and imports
- [ ] [R81] Transactional behavior prevents partial writes for invalid classification saves, invalid market saves, invalid formulation payloads, and invalid imports
- [ ] [R82] Save and retrieval flows meet source-supported interactive thresholds; multi-market and composition retrieval avoid unnecessary extra round trips
- [ ] [R83] Full composition and multi-market retrieval use efficient query patterns consistent with the monolith architecture and source-supported indexed lookup expectations
- [ ] [R84] The implementation does not introduce unrelated domain concepts beyond the regulatory assessment and composition scope described
- [ ] [R85] Tests or verification cover the highest-risk paths: validation blocking, authorization denial, non-destructive updates, single-record import behavior, and preservation of nested composition data

## Traceability

- [ ] [R86] Every implemented change maps back to the listed user-story acceptance criteria for feature 64917
- [ ] [R87] Every non-blocking Open Question that was implemented has a recorded decision + one-line rationale in assumptions documentation (no Open Question is silently assumed)
- [ ] [R88] No blocking Open Question was implemented as an assumption; unresolved blocking questions hold completion until clarified

## Assumptions

### ASM-1
- [R89] Statement: The feature is implemented within an existing monolith application and should extend current assessment/composition modules rather than introducing a new service boundary.
- [R90] Source: Feature state includes user-selected architecture style `monolith`; source context references existing screens, APIs, and assessment records.
- [R91] Rationale: The source names a monolith architecture and existing application flows but does not define any separate service decomposition.
- [R92] Potential impact: Implementation should favor in-process modules, shared persistence, and existing monolith conventions.
- [R93] Confidence: high
- [R94] Recommended resolution: Confirm the target module boundaries and extension points in the current codebase before implementation.

### ASM-2
- [R95] Statement: The “single regulatory assessment record” for ABCD Shampoo is the same logical record that stores classifications, market context, formulation/composition data, and imported evidence.
- [R96] Source: Feature description and multiple stories repeatedly require consolidation into a single regulatory assessment record.
- [R97] Rationale: The source consistently describes one consolidated record, but does not define whether all sections share one physical table or linked tables.
- [R98] Potential impact: Data model and transaction design should preserve one logical record identity across linked entities.
- [R99] Confidence: high
- [R100] Recommended resolution: Confirm the canonical record key and linked entity model used by the existing assessment domain.

### ASM-3
- [R101] Statement: Source-supported “final submission,” “setup completion,” and “section complete” actions are separate completion checkpoints that must validate only the fields explicitly required by the corresponding stories.
- [R102] Source: Stories separately mention setup completion, final assessment submission, substance documentation completion, and ingredient section completion.
- [R103] Rationale: The source distinguishes multiple completion actions but does not provide a global workflow definition tying them together.
- [R104] Potential impact: Validation should be scoped to the relevant workflow step to avoid over-blocking unrelated saves.
- [R105] Confidence: medium
- [R106] Recommended resolution: Confirm the existing workflow state model and which validations run on draft save vs completion/finalization actions.

## Notes

- [R107] Mark an item complete only after verifying implementation code and observable behavior.
- [R108] Do not silently assume unresolved product decisions; obtain clarification or record a non-blocking decision explicitly before completion.