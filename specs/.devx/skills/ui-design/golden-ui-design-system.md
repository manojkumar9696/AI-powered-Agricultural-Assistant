# Golden Repository UI/UX Design System

Generated for: AABC
Repository: AgentFactory
Generated at: 2026-08-28T06:19:31.107Z

## Warnings

- None

## How To Use

- Read this file before UI implementation to align with the Golden Repository design language.
- Apply these design tokens, component rules, and accessibility requirements when building UI.
- Use `golden-ui-design-sources.md` for the exact UI/design source excerpts and file-path attribution.
- Existing UI conventions in the target workspace override generic guidance when they conflict.
- Do not invent tokens, components, screens, or flows that are not defined here.
- Do not require live Golden Repository access inside the implementation workspace.

## Design System

## Design Principles & Brand

### Core Design Principles

- **Readable over clever** — UI and code should be easy for another person to understand and maintain
- **Single Responsibility** — a component/function should have one clear responsibility
- **DRY** — avoid unnecessary duplication
- **KISS** — prefer simple solutions unless complexity provides measurable value
- **Separation of concerns** — appropriately separate UI, business logic, data access, and integration logic
- **Prefer small, focused functions and components**

### Safety & Validation

- **Fail safely** — handle expected failures explicitly; avoid exposing sensitive information to end users
- **Validate at system boundaries** — validate user input before processing

### Human-in-the-Loop

- Every AI-assisted decision requires human confirmation
- Human experts remain in the loop to vet, validate, and verify AI-enabled outputs

## Components & Patterns

### Validation & Error Handling Patterns

- **Validation pattern**: System identifies missing/invalid information and prevents submission; displays appropriate validation messages.
- **Authorization pattern**: System prevents action when user lacks required permission.
- **Error handling pattern**: System handles errors gracefully and provides an appropriate, actionable message without exposing internals.
- **Missing-information gate**: A gate applies before applicable document generation to ensure required data is present.
- **Error differentiation**: Distinguish validation, authorization, business-rule, integration, and system errors.

### Response Structures

#### Error Response

| Field | Description |
|-------|-------------|
| `errorCode` | Standardized error code (e.g., `ASSIGNMENT_VALIDATION_ERROR`) |
| `message` | Meaningful, actionable message (e.g., "Host country is required.") |
| `correlationId` | Unique ID for support/troubleshooting |

#### Success Response

| Field | Description |
|-------|-------------|
| Resource ID (e.g., `assignmentId`) | Identifier of the created/affected resource |
| `status` | Current status of the resource |
| `message` | Confirmation or informational message |

### API Patterns

- **Pagination**: Use pagination for large collections.
- **Correlation/request IDs**: Include in all API responses and logs.

### Portal & Dashboard Components

- **Assignee Portal**: Purpose-built, mobile-responsive assignee experience.
- **Coordinator Work Queue**: SLA tracking, case detail, bulk actions, reassignment.
- **Assignment Hub**: Displays assignment status/stage, dates, milestones, counters, costs, actions, and point of contact.
- **Programme Command Centre**: Programme-level visibility including assignment population, costs, locations, timelines, compliance, where-in-the-world views, regional/business-unit/assignment-type cost roll-ups.

## Interaction & Motion

### Performance Targets

- **Assignment save:** ≤ 1.5 seconds (p95 target)
- **Calculation round-trip:** ≤ 4.0 seconds (p95 target)
- **Programme Command Centre load:** ≤ 3.5 seconds (p95 target)
- **AI Assistant first token:** ≤ 1.0 second (p95 target)

## Accessibility

### General Accessibility Requirements

- Accessibility is a non-functional requirement applicable to all user stories
- Assignee portal must be purpose-built and mobile-responsive

## UI Naming & Structure

### Naming Conventions

- **Classes**: PascalCase (e.g., `AssignmentService`)
- **Methods**: camelCase (e.g., `createAssignment()`)
- **Variables**: camelCase (e.g., `assignmentStartDate`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_ASSIGNMENT_DAYS`)
- **Booleans**: question/condition oriented (e.g., `isActive`, `hasApproval`)
- **API resources**: plural noun (e.g., `/assignments`)
- Avoid vague names such as `data`, `temp`, `obj`, `value1`, `abc`, `test`; prefer names that describe business meaning.

### REST Resource Pattern

| Verb | Endpoint |
|--------|--------------------------|
| GET | `/assignments` |
| GET | `/assignments/{id}` |
| POST | `/assignments` |
| PUT | `/assignments/{id}` |
| PATCH | `/assignments/{id}` |
| DELETE | `/assignments/{id}` |

### Key User Roles / Personas

- Assignee
- Coordinator
- HR Users
- Programme / Portfolio Users
- Mobility Manager
- Vialto SMEs
- Vialto Administrators

### Primary Application Areas

- Assignment Initiation
- Assignment Setup
- Workflow & Approvals
- Task Management
- Coordinator Queue
- Assignee Portal
- Cost Projection / Balance Sheet
- Documents & E-Signature
- Payroll Instructions
- Programme Command Centre
- Immigration Compliance
- AI Assistant

### Assignment Lifecycle Stages

Initiation → Pre-departure → In-assignment → End-of-assignment

### Platform / Application Boundary

- Shared reusable capabilities belong in the **VIA platform** layer.
- Assignment-specific UI, data, and rules belong in the **AM application** layer.