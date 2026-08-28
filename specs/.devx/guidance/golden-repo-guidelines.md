# Golden Repository Implementation Guidelines

Generated for: AABC
Repository: AgentFactory
Generated at: 2026-08-28T06:19:31.106Z
File selection mode: all vectorized files

## Warnings

- None

## How To Use

- Read this file before implementation in the IDE.
- Use `golden-repo-sources.md` for exact source excerpts and file-path attribution.
- Use Golden Repo guidance for conventions, patterns, validation expectations, architecture style, testing expectations, and implementation constraints.
- Do not invent product scope, endpoints, screens, fields, permissions, jobs, or workflows from Golden Repo guidance alone.
- Existing code patterns in the target workspace override generic Golden Repo guidance when they conflict.
- Do not require live Golden Repository access inside the implementation workspace.

## Extracted Guidance

GOLDEN REPO KNOWLEDGE CONTEXT (spec generation)
Repository: AgentFactory
The following is a distilled, de-duplicated consolidation of the Golden Repository standards and reference guidance (summarized from the full corpus to preserve all distinct constraints without repetition). Use it as guidance only. It may define terminology, architecture conventions, validation expectations, examples, and output style. Do not extract or invent product scope, endpoints, screens, fields, or requirements from this guidance alone.

## Architecture & System Design

### Platform vs. Application Boundaries

- Shared, reusable capabilities belong in the platform (VIA); application-specific capabilities (Assignment Management) own only their application-specific layer.
- Never duplicate shared functions inside the application.
- Related products may provide reference patterns but are not a codebase to fork or a dependency.
- Govern cross-team seams with versioned contracts between platform and application boundaries.

### Separation of Concerns

- Appropriately separate UI, business logic, data access, and integration logic.
- Use a shared integration orchestration layer (e.g., Workato) rather than point-to-point HRIS/payroll integrations.

### Resilience & Fallback Behavior

- If a dependency (e.g., NLP model, Presidio) cannot be loaded, the system must still start and fall back to simpler processing (e.g., regex-based masking) so dependent services continue to work.

### Processing Pipeline Design

- Combine regex/heuristic detection with entity-aware NLP detection (e.g., Presidio + spaCy) for defense in depth (multi-layer processing pipeline).
- Support large input scanning with chunk overlap to avoid missing detections at boundaries.

### Configuration & Business Rules

- Avoid hard-coded business rules; rules that may change should be configuration-driven.
- Configuration is introduced when real variation emerges rather than designed generically in advance.

### Workflow & State Management

- Workflow state must be durable.
- Assignment activity must maintain an immutable audit trail.

## API & Integration Conventions

### REST Resource Conventions

- Use plural nouns for resource paths:
  - `GET /assignments`
  - `GET /assignments/{id}`
  - `POST /assignments`
  - `PUT /assignments/{id}`
  - `PATCH /assignments/{id}`
  - `DELETE /assignments/{id}`
- Use appropriate HTTP status codes.
- Validate request payloads.
- Return consistent response structures.
- Use pagination for large collections.
- Support correlation/request IDs in all requests and responses.
- Maintain backward compatibility where possible.

### Response Standards

- Example success response:
  ```json
  {"assignmentId": "AM-10025", "status": "ACTIVE", "message": "Assignment retrieved successfully"}
  ```
- Never expose passwords, tokens, or sensitive information in API responses.

### Documentation

- Document APIs using OpenAPI/Swagger where applicable.

### Domain-Specific Endpoints

- **Scan endpoint** (`POST /api/scan`):
  - Request body contains `text`.
  - Response includes: `masked_text`, `risk`, `detections`, `detection_count`, `action`, `latency_ms`, `layers`.
  - Risk classification levels: `low`, `medium`, `high`, `critical`.
- **Health endpoint** (`GET /health`):
  - Returns `{"status":"ok"}`.

## Data Model & Validation

### Input & Boundary Validation

- Validate at system boundaries — validate all user and API input before processing.
- Boundary/edge-case validation must cover: minimum values, maximum values, empty values, and null values.
- A missing-information gate applies before applicable document generation (prevent submission when mandatory data is absent).
- Assignment validation examples:
  - Missing host country
  - Invalid dates
  - End date before start date
  - Duplicate assignment

### Principal Business-Data Domains

- Worker
- Organisation
- Client / Entity
- Assignment
- Assignment Type
- Policy
- Tasks
- Milestones
- Cost Projection
- Balance Sheet
- Documents
- Payroll Instructions
- Immigration / Work Authorisation
- Notifications
- User / Access
- Audit Information

### Data Ownership

- Application-specific data and business rules belong in the application.
- Shared master data is a platform responsibility.

## Security & Compliance

### Error Handling & Information Disclosure
- Never expose stack traces, database errors, credentials, or internal implementation details to end users.

### Secrets & Credentials Management
- No secrets or hard-coded credentials in code.
- AI tools must never receive secrets, credentials, or restricted data.

### Logging & Audit
- Do not log passwords, authentication tokens, or unnecessary sensitive personal information.
- Log security-relevant events appropriately.
- AI per-answer audit logging required.

### Data Protection & Privacy
- PII must be handled as sensitive personal information; encryption in transit and at rest required.
- Data-residency controls must be respected; offshore development/QA must use synthetic or masked data where real-tenant residency requirements apply.
- **Privacy detection categories (Layer 1):** API keys, passwords, JWTs, bearer tokens, cloud credentials, credit cards, street addresses, email addresses, phone numbers, IP addresses, URLs, ID-like values.
- **Entity-aware detection (Layer 2):** person names, phone numbers, emails, credit cards, other Presidio-supported entities.

### Access Control & Identity
- Access control through identity platform (SSO, claims, delegated access).
- Logged "act on behalf of" access where supported.

### Compliance & Certification
- SOC 2 Type II posture/path and ISO 27001 posture/path required.
- SAST/SCA controls required.
- Two third-party penetration tests before production cut-over.

### AI-Specific Security Controls
- Every AI-assisted decision requires human confirmation at MVP; human-in-the-loop is mandatory.
- AI cost ceilings and circuit breaker required.
- AI tools must never receive secrets, credentials, or restricted data.

## Testing & Quality Expectations

### Automated Unit Test Coverage

- Business-critical functions must have appropriate automated unit tests covering:
  - **Positive scenarios** — valid input produces expected result.
  - **Negative scenarios** — invalid input produces expected validation/error.
  - **Boundary scenarios** — minimum, maximum, empty, and null values.
  - **Exception scenarios** — external service failure, database failure, unexpected responses.
  - **Regression scenarios** — changes do not break existing behaviour.

### Domain-Specific Test Examples

- Assignment-specific test cases must include:
  - Valid assignment creation
  - Missing host country
  - Invalid dates
  - End date before start date
  - Duplicate assignment
  - Unauthorized user
  - Integration failure
  - Assignment extension

### AI-Generated Code Validation

- AI-generated code must be validated with automated tests and appropriate static/security analysis.
- Do not assume AI-generated code is correct simply because it compiles or passes a single test.

### AI Evaluation Harness

- Golden test set provided by SMEs.
- Measured thresholds:
  - ≥95% groundedness
  - ≥98% citation accuracy
  - ≥80% answer rate
  - ≤20% deflection rate
- These thresholds are measured and reported but are not binding launch gates at MVP.

## UI/UX & Accessibility

### Mobile & Responsive Design
- Assignee experience must be purpose-built and mobile-responsive.

### Accessibility
- Accessibility requirements apply as a non-functional requirement on every story.

## Domain & Business Rules

### Assignment Lifecycle

- **Lifecycle stages**: initiation → pre-departure → in-assignment → end-of-assignment.

### Assignment Initiation

- System creates an assignment and generates a unique assignment reference upon successful submission.
- Successful assignment creation must record audit information (creator, date/time).
- Missing mandatory information must prevent submission, with identification of the specific missing fields.
- Users without the required permission must be prevented from performing the action.

### AI Governance

- Groundedness, citation accuracy, answer rate, and deflection rate are measured per answer.
- Human escalation is required (as part of the AI governance model).

### Delivery Model

- Fixed-date, fixed-budget delivery model with scope as the variable.

### Configuration Strategy

- Configuration is extracted only when real variation emerges across design partners.

## Naming, Structure & Code Patterns

### Naming Conventions

- **Class**: PascalCase (e.g., `AssignmentService`)
- **Method**: camelCase (e.g., `createAssignment()`)
- **Variable**: camelCase (e.g., `assignmentStartDate`)
- **Constant**: UPPER_SNAKE_CASE (e.g., `MAX_ASSIGNMENT_DAYS`)
- **Boolean**: Question/condition oriented (e.g., `isActive`, `hasApproval`)
- **API resource**: Plural noun (e.g., `/assignments`)
- Avoid vague names: `data`, `temp`, `obj`, `value1`, `abc`, `test`. Prefer names describing business meaning.

### Code Design Principles

- **Single Responsibility**: A class/function should have one clear responsibility.
- **DRY**: Avoid unnecessary duplication.
- **KISS**: Prefer simple solutions unless complexity provides measurable value.
- **Readable over clever**: Code should be easy for another developer to understand and maintain.
- Prefer small, focused functions and components.
- Use meaningful comments only where they add context; do not comment obvious code.

### User Story & Acceptance Criteria Format

- **User story ID format**: `AM-XXX`
- **Acceptance criteria format**: Given / When / Then (GWT)
- Standard AC categories: successful scenario, validation, authorization, error handling.

### Project Layout

- **Example (FastAPI Backend)**:
  ```
  FastAPI_Backend/
  ├─ app/ (main.py, pipeline.py, anonymizer.py, normal_masker.py, presidio_detector.py, detectors.py, chunking.py, risk.py, cache.py, schemas.py)
  ├─ tests/ (test_privacy_pipeline.py)
  ├─ requirements.txt
  └─ README.md
  ```

## Error Handling & Resilience

### Error Response Standards

- Errors must be meaningful, consistent, actionable, and appropriately logged.
- Use standardized error codes where practical.
- Include a correlation ID in every error response for support and troubleshooting.
- Differentiate error categories: validation, authorization, business-rule, integration, and system errors.

**Example error response:**
```json
{
  "errorCode": "ASSIGNMENT_VALIDATION_ERROR",
  "message": "Host country is required.",
  "correlationId": "abc-123"
}
```

### Security & Safe Failure

- Do not expose stack traces, database errors, credentials, or internal implementation details to end users.
- Fail safely: handle expected failures explicitly and avoid exposing sensitive information.

### AI Resilience

- AI circuit breaker and human escalation required.

## Performance & Observability

### Interaction Performance Targets (p95)

These are 12-month design-scale targets, not MVP gates:

- **Assignment save:** ≤ 1.5 seconds
- **Calculation round-trip:** ≤ 4.0 seconds
- **Programme Command Centre load:** ≤ 3.5 seconds
- **AI Assistant first token:** ≤ 1.0 second

### Availability & Recovery

- **Availability:** 99.9 % (24×5), 99.5 % (24×7)
- **Tier-1 RTO:** 2 hours
- **Tier-1 RPO:** 15 minutes

### Design-Scale Volumes

- ~25,000 assignees
- ~2,000 concurrent users
- ~400 assignments initiated per day

### Logging Standards

- Use structured logging wherever practical.
- Log application events and important business transactions.
- Log integration failures and exceptions.
- Include correlation IDs in all log entries.
- Ensure log retention follows organizational and regulatory requirements.

### Observability at Design Scale

- Support distributed tracing across services.
- Provide structured logging with correlation.
- Collect and expose metrics (e.g., scan endpoint response includes `latency_ms`).
- Maintain performance dashboards.
- Maintain AI-governance dashboards.