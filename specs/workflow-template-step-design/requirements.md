# Implementation Requirements Checklist

**Purpose**: Provide an implementation acceptance checklist that agents can execute one item at a time.
**Feature**: As an administrator, I want to design workflow templates with configurable steps to achieve tailored processes (DEMO22-522)

## Functional Acceptance Criteria

- [ ] [R1] Administrators can create a new workflow template from the workflow template designer screen
- [ ] [R2] Administrators can add one or more steps to a workflow template
- [ ] [R3] Administrators can edit the properties of any existing step in a workflow template (e.g., name, description)
- [ ] [R4] Administrators can delete a step from a workflow template, with the remaining steps and transitions updating accordingly
- [ ] [R5] Each workflow step can be assigned to one or more specific roles
- [ ] [R6] Conditional logic (rules/expressions) can be defined on transitions between steps to control flow
- [ ] [R7] Templates can be saved in a **draft** status
- [ ] [R8] Templates can be saved in a **published** status
- [ ] [R9] A visual workflow diagram renders the current template design for review
- [ ] [R10] Multiple versions of a workflow template can be managed (create new version, view version history)
- [ ] [R11] Only users with the Administrator persona/role can access the workflow template designer and perform CRUD operations

## UI Acceptance Criteria

- [ ] [R12] A dedicated "Workflow Template Designer" screen is accessible from the administration area
- [ ] [R13] The designer provides intuitive controls (buttons/menus) to add, edit, and delete steps
- [ ] [R14] Role assignment is available per step via a selectable list or dropdown of system roles
- [ ] [R15] Conditional logic configuration is presented in a clear, form-based or expression-builder UI on transitions
- [ ] [R16] A visual diagram (e.g., flowchart/graph) renders steps and transitions and updates in real time as the template is modified
- [ ] [R17] Draft and published statuses are clearly indicated in the UI (e.g., badge, label)
- [ ] [R18] Version list or selector is available so administrators can view and manage template versions
- [ ] [R19] Validation messages are displayed when required fields are missing or conditional logic is invalid before saving
- [ ] [R20] The design interface follows existing application design-system conventions (typography, spacing, color, component library)
- [ ] [R21] The interface is responsive and accessible (keyboard navigable, appropriate ARIA labels, sufficient contrast)

## API and Integration Acceptance Criteria

- [ ] [R22] API endpoint(s) exist to create, read, update, and delete workflow templates
- [ ] [R23] API endpoint(s) exist to add, edit, reorder, and delete steps within a template
- [ ] [R24] API supports assigning and unassigning roles to/from individual steps
- [ ] [R25] API supports creating and updating conditional logic on transitions between steps
- [ ] [R26] API supports saving a template with a status of `draft` or `published`
- [ ] [R27] API supports creating a new version of an existing template and retrieving version history
- [ ] [R28] All template designer endpoints enforce Administrator-level authorization; non-admin requests receive a 403 Forbidden response
- [ ] [R29] API input validation returns clear error responses for malformed or incomplete requests
- [ ] [R30] Existing API contracts in the monolith are not broken by the new endpoints

## Business Logic and Data Acceptance Criteria

- [ ] [R31] A workflow template entity exists with at minimum: id, name, description, status (`draft` | `published`), version number, created/updated timestamps, and owning user reference
- [ ] [R32] A workflow step entity exists with at minimum: id, template reference, step name, step order/position, assigned role(s), and metadata fields
- [ ] [R33] A transition entity exists linking source step to target step with an optional conditional-logic expression
- [ ] [R34] Status transitions are enforced: a template may move from `draft` → `published`; behavior for `published` → `draft` (unpublish) must follow the resolved decision from Open Questions (do not assume)
- [ ] [R35] Publishing a template validates that it has at least one step and all required fields are populated
- [ ] [R36] Deleting a step cascades removal of associated transitions
- [ ] [R37] Version management creates an immutable snapshot when a new version is created; prior versions remain accessible read-only
- [ ] [R38] Conditional logic expressions are validated for syntactic correctness before persistence
- [ ] [R39] Edge case: attempting to delete the only step in a template is handled gracefully with a user-facing message

## Non-Functional Acceptance Criteria

- [ ] [R40] Only authenticated administrators can access the designer; role-based access control is enforced at both UI and API layers
- [ ] [R41] Template data is persisted in the monolith's primary data store with appropriate schema migrations
- [ ] [R42] Audit trail or logging captures create, update, delete, and publish actions on templates and steps (regulated insurance environment)
- [ ] [R43] The visual diagram renders acceptably for templates with up to a reasonable step count (e.g., 50 steps) without significant UI lag
- [ ] [R44] Unit and/or integration tests cover: step CRUD, role assignment, conditional logic validation, draft/publish lifecycle, version creation, and authorization enforcement

## Traceability

- [ ] [R45] AC-1 (add, edit, delete steps) → Step CRUD functionality implemented and verified
- [ ] [R46] AC-2 (assign roles to steps) → Role assignment per step implemented and verified
- [ ] [R47] AC-3 (conditional logic between steps) → Transition conditional logic implemented and verified
- [ ] [R48] AC-4 (save as drafts) → Draft status persistence implemented and verified
- [ ] [R49] AC-5 (user-friendly design interface) → Visual diagram, intuitive controls, validation messages, and accessibility implemented and verified
- [ ] [R50] Key Functionality items (publish status, visual diagram, version management) → Corresponding checklist items above implemented and verified
- [ ] [R51] Every non-blocking Open Question that was implemented has a recorded decision and one-line rationale in `specs/workflow-template-designer/assumptions.md`
- [ ] [R52] No BLOCKING Open Question was implemented as an assumption

### Open Questions (must not be silently assumed)

1. [R53] **Published → Draft transition**: Can a published template be reverted to draft? What happens to active workflow instances using that published version? — Must be clarified before implementing unpublish behavior.
2. [R54] **Conditional logic expression language**: What syntax or expression language is used for transition conditions (e.g., simple key-value rules, a scripting DSL, JSON-based rules engine)? — Must be clarified before implementing the expression builder and validator.
3. [R55] **Version management semantics**: When a new version is created, is the previous published version automatically deprecated, or can multiple published versions coexist? — Must be clarified before implementing version lifecycle rules.
4. [R56] **Role source**: Are assignable roles sourced from an existing role/permission system in the monolith, or is a new role catalog needed? — Must be clarified before implementing role assignment.
5. [R57] **User interaction flow completeness**: The source user interaction flow is truncated at "Clicks on…" — the full intended flow must be confirmed before finalizing navigation and interaction design.

## Assumptions

### ASM-1
- [R58] **Statement**: The visual workflow diagram is rendered client-side (e.g., using a JavaScript diagramming library) rather than generated server-side as an image.
- [R59] **Source**: Feature description mentions "Visual workflow diagram for review" without specifying rendering approach.
- [R60] **Rationale**: A monolith architecture with a web front-end conventionally uses client-side rendering for interactive diagrams; this supports real-time updates as the administrator edits.
- [R61] **Potential impact**: If server-side rendering is required (e.g., for PDF export), additional work would be needed.
- [R62] **Confidence**: high
- [R63] **Recommended resolution**: Confirm with stakeholders whether client-side interactive rendering is acceptable or if static/exportable diagrams are also required.

### ASM-3
- [R70] **Statement**: Version numbers are auto-incremented integers (v1, v2, v3…) managed by the system, not user-supplied.
- [R71] **Source**: Feature description mentions "Manage multiple versions of templates" without specifying versioning scheme.
- [R72] **Rationale**: Auto-increment is the simplest, least error-prone approach and is standard for template versioning.
- [R73] **Potential impact**: If semantic versioning or user-defined labels are needed, the data model and UI must be extended.
- [R74] **Confidence**: medium
- [R75] **Recommended resolution**: Confirm versioning scheme with stakeholders.

## Additional Features

### ASM-2
- [R64] **Statement**: A workflow template must contain at least one step to be published, but a draft may be saved with zero steps.
- [R65] **Source**: Not explicitly stated in acceptance criteria; inferred from typical draft/publish semantics.
- [R66] **Rationale**: Allowing empty drafts supports incremental design; requiring at least one step for publish ensures a published template is usable.
- [R67] **Potential impact**: If drafts also require at least one step, the save-as-draft validation logic changes.
- [R68] **Confidence**: medium
- [R69] **Recommended resolution**: Confirm minimum step requirements for both draft and published states.

## Notes

- [R76] Never resolve an Open Question silently. In an unattended run, record the chosen assumption and rationale in `specs/workflow-template-designer/assumptions.md`; blocking questions must instead hold the feature at `needs-clarification`.
- [R77] Mark an item complete only after verifying actual implementation code and behavior.
- [R78] The truncated user interaction flow in the source should be obtained in full before finalizing UI navigation implementation.