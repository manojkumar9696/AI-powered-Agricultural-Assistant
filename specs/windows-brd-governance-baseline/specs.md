# Feature: Windows Application Baseline for specstest
Status: NEW
Owner: Astra
Last Updated: 2026-09-07

## Summary
The Windows Application Baseline for specstest establishes the controlled baseline records, review gates, and governance controls required to implement specstest as an approved Windows desktop application. The feature ensures that the project has an authoritative BRD baseline, a governed architecture baseline identifying the solution as a Windows application, documented runtime prerequisites, packaging and deployment decisions, controlled scope and integration changes, and enforced build-readiness gates before build finalization.

The expected outcome is that authorized users can create, review, approve, retrieve, and audit baseline records tied to the specstest project, while the system prevents unsupported scope, unapproved integrations, incomplete metadata, unauthorized changes, and premature build finalization.

## Scope
### In Scope
- Establishing the architecture baseline for specstest with `applicationType` set to `Windows`, linked to the correct `projectId` and `requirementId`
- Maintaining a controlled BRD baseline with required metadata, version control, duplicate active-version prevention, traceability visibility, and audit logging
- Capturing BRD requirement records with mandatory `sourceRequirementId` validation against approved source-backed scope items
- Recording immutable change history for BRD requirement records
- Managing BRD lifecycle/version/status transitions and preserving superseded versions as read-only history
- Providing a formal BRD review workflow for assigned Stakeholder Reviewers, including decision capture, comment requirements, and review history
- Finalizing BRD approval outcomes only after required reviews and metadata checks are complete
- Recording supported Windows client prerequisites, including supported Windows OS values and runtime dependency entries
- Capturing runtime prerequisite security review outcomes and linking them to baseline approval evidence
- Recording a single Windows packaging approach for the architecture baseline, with required metadata, approval state, retrieval, and audit history
- Recording the Windows deployment method in the architecture baseline, with required inputs, approval controls, and audit history
- Presenting packaging and deployment information together in a controlled architecture baseline section for operational reference
- Enforcing controlled architecture baseline review states and status transitions for build-planning visibility
- Controlling scope additions and integration changes so they require approved source-backed requirements before approval
- Blocking unsupported external integration proposals and unsupported integration assumptions unless backed by approved source requirements linked to the project BRD baseline
- Providing build-readiness and build-finalization gates based on BRD approval, architecture approval, runtime prerequisites, packaging approach, deployment method, and required architecture baseline elements
- Enforcing RBAC, immutable audit logging, filtered audit log retrieval, authenticated access, encrypted transport, and security event capture for controlled baseline records

### Out of Scope
- Generating installer binaries or signing packages
- Defining non-Windows packaging formats
- Configuring enterprise software distribution tools beyond documenting the deployment and packaging approach
- Detailed endpoint management tooling configuration
- Retail store device rollout, POS synchronization, omnichannel fulfillment logic, retail workflows, supplier APIs, marketplace APIs, or unrelated domain integrations
- Designing or implementing approved external integrations themselves
- Editing downstream architecture artifacts from the BRD traceability view beyond viewing traceability linkage
- Creating new business process requirements unrelated to the existing specstest Windows application baseline
- External BRD publication or distribution workflows outside the controlled repository
- Automated vulnerability scanning of prerequisite binaries
- Packaging implementation, installer creation, deployment scripts, or CI/CD pipeline execution
- Automated end-user machine readiness detection
- Workflow changes to BRD approval beyond the documented review and approval behaviors
- Manual override approval chains or exception management beyond logging blocked attempts
- External vendor approval platforms, e-signature platforms, procurement systems, or advanced customization not separately approved
- Bulk lineage views across multiple BRD records in a single screen
- Exporting history to external reporting tools or spreadsheets
- Personalized reviewer layouts or configurable field ordering
- Notification workflow details beyond queueing owner notification after review action save

## Application Type & Platform Context
The feature targets a mixed application context:
- Windows desktop application baseline and desktop execution model are explicitly in scope
- UI interactions are explicitly described for opening baseline records, navigating sections, reviewing entries, and submitting workflow actions
- API operations are explicitly described for baseline, packaging, deployment, review, approval, traceability, readiness, security, and audit access

Source evidence:
- “Establish the specstest solution as a Windows application”
- “Define the core Windows application structure, runtime expectations, and desktop execution model”
- Multiple stories specify UI interaction flows for opening baseline views and review screens
- Multiple stories specify API endpoints such as `/api/architecture/baselines/{id}/packaging`, `/api/brd/{projectId}`, `/api/change-requests`, `/api/projects/{id}/build-readiness`, and `/api/audit-logs`

## Actors and Permissions
### Actors
- Solution Architect
- Desktop Engineer
- Deployment Manager
- Business Analyst
- Project Manager
- Requirements Manager
- Stakeholder Reviewer
- Approval Manager
- Release Manager
- Information Security Analyst
- Security Administrator
- Security Architect
- Audit Manager
- Enterprise Architect
- Solution Reviewer
- Reviewer role (generic reviewer role referenced in several stories)

### Supported Permissions and Access Constraints
- **Solution Architect / reviewer-authorized roles**
  - May create, update, and submit architecture baseline records for Windows application designation
- **Desktop Engineer**
  - May update packaging records
- **Reviewer**
  - May approve packaging records
- **Deployment Manager**
  - May define and submit deployment method details
- **Business Analyst / reviewer**
  - May update BRD baseline metadata
- **Business Analyst**
  - May create and update BRD requirement records
- **Audit Manager / reviewer**
  - May retrieve BRD requirement history
- **Requirements Manager**
  - May perform authorized BRD status/version transitions subject to configured transition rules
- **Assigned Stakeholder Reviewer**
  - May submit review actions only when assigned to the current BRD review stage
  - May access standardized BRD review format in read-only mode
- **Approval Manager / authorized approver**
  - May finalize BRD approval decisions
- **Release Manager**
  - May update prerequisites where story-specific role permits
  - May request and view build readiness evaluations
  - May update prerequisite readiness status or complete final approval when holding release approval permissions
- **Information Security Analyst**
  - May create and update runtime prerequisite security review outcomes
- **Project Manager / approver**
  - May create change requests and perform controlled change approvals as permitted
  - May access build readiness/finalization functions where authorized project roles permit
- **Enterprise Architect**
  - May submit external integration proposals and compliance checks subject to validation
- **Security Administrator**
  - May retrieve security roles, update role assignments, and query audit logs with filters
- **Security Architect**
  - Requires access to audit reporting and secure repository controls; specific action permissions beyond review/reporting are not fully specified
- **Unauthorized users**
  - Must receive authorization errors for protected create, update, approve, history retrieval, review action, security endpoint, audit endpoint, readiness evaluation, and build finalization operations
  - Unauthorized modification attempts must not persist changes and must be audit logged where specified

### Open Permission Questions
- Exact role names and permissions for architecture baseline approval are not fully enumerated across all architecture-related stories
- Whether read access to all baseline records is role-restricted by record type is not fully defined beyond cited flows

## Feature Development Intent
This is feature-development work to implement the governed baseline and approval capabilities required for specstest build readiness and Windows desktop delivery. The system behavior to be built or changed includes:
- Controlled persistence of BRD, architecture, packaging, deployment, prerequisite, change-control, and integration-governance records
- Validation of mandatory metadata, traceability links, duplicate version restrictions, controlled status transitions, and source-backed scope requirements
- Role-based authorization around view, create, update, approve, review, readiness, and audit actions
- Immutable audit and history tracking for changes, approvals, denied attempts, and gate evaluations
- Build and release readiness gating that blocks finalization unless required baseline records are present, complete, and approved

The delivered outcome must be an implementation-ready governance foundation in which specstest can proceed as a Windows application only when controlled baseline evidence is complete and approved.

## UI Design & Interaction Contract
### Source-Supported UI Areas
- Architecture baseline record
- Packaging section within the architecture baseline
- Deployment method details within the architecture baseline
- Client prerequisites section within the architecture baseline
- BRD baseline record view/edit
- BRD requirement entry form
- BRD requirement detail and review views
- BRD requirement change history view
- BRD versions/history views
- BRD review worklist or direct review link
- BRD approval summary
- Project change control record
- Integration definition/compliance area
- Build readiness or build finalization view
- Final build approval screen
- Project reporting/build-planning view for architecture baseline gate status
- Audit log retrieval view/filtering experience for Security Administrator users

### UI Behavior
- Users can open project-linked BRD and architecture baseline records and navigate to controlled sections such as packaging, deployment method, and prerequisites
- Packaging, deployment, and prerequisite sections must load the current stored record for the selected baseline/project context
- BRD review views must show requirement entries, document metadata, and current workflow status for the selected BRD version
- Standardized BRD entry review format must display, in the same field order for every entry:
  - requirement title or statement
  - detailed content
  - source information
  - workflow status
  - version number
  - baseline indicator
- BRD review format must visually distinguish `Draft`, `In Review`, and `Approved` with explicit status labels and may not rely on color alone
- If multiple versions exist for the same BRD entry, exactly one approved baseline version is marked current and superseded versions are labeled non-active
- Stakeholder Reviewer review screens must be read-only for entry content and must not present edit controls or update actions
- If required BRD metadata for standardized review is missing, the UI must show a clear incomplete-entry message identifying the missing field rather than a partial unlabeled layout
- BRD requirement history view must:
  - be read-only
  - show entries in reverse chronological order
  - provide no edit or delete control for history entries
  - include metadata changes, content changes, and approval-state changes in the same timeline
- Build readiness/build finalization views must show separate statuses for BRD approval and architecture approval
- Non-ready states in build readiness must identify the specific record state, including `Missing`, `Incomplete`, `Pending Review`, or `Rejected` where applicable
- Architecture readiness results must list each failed condition separately, including missing or unapproved:
  - runtime prerequisites
  - packaging approach
  - deployment method
  - architecture scope where required by build-finalization stories
- Blocking responses for build finalization must name each unmet gate condition
- Packaging and deployment information must be presented together in a single controlled section for operational reference
- Approved packaging and deployment information must be accessible to release and support stakeholders before build finalization

### Validation and Error Messaging
The source supports the following validation/error behaviors:
- Authorization error for unauthorized protected actions
- Field-level errors for blank strings, null values, and baseline/project mismatches in packaging
- Duplicate-version error response for BRD active baseline duplication
- Specific validation error for unknown, unapproved, or inactive `sourceRequirementId`
- Validation error for invalid architecture status transitions, including direct `Draft` to `Approved`
- Clear incomplete-entry message identifying missing display metadata fields
- Blocking reason identifying BRD condition or architecture condition on failed build finalization
- Access-denied response for unauthorized build finalization attempts

### Accessibility Expectations
- No status indication may rely on color alone in BRD review
- Explicit status labels are required
- No additional accessibility standards are specified in the source

## API Contract
### Architecture Baseline
#### Retrieve project requirements
- **Operation:** `GET /api/projects/{projectId}/requirements`
- **Purpose:** Fetch valid requirement references for architecture baseline creation/update
- **Validation/Rules:** Selected `requirementId` for architecture baseline must exist in results for the same project

#### Retrieve current architecture baseline
- **Operation:** `GET /api/architecture/baselines/{id}`
- **Purpose:** Retrieve current baseline data, including prerequisite context where used

#### Create/update architecture baseline
- **Operation:** `POST` or `PUT` architecture baseline records in the architecture baseline repository
- **Purpose:** Persist architecture baseline with `applicationType = Windows`
- **Required inputs supported by source:** `applicationType`, `projectId`, `requirementId`
- **Validation/Rules:**
  - `applicationType` must equal `Windows`
  - `projectId` and `requirementId` are mandatory
  - Review submission must be rejected if `applicationType`, `projectId`, or `requirementId` is missing
  - `requirementId` must belong to the selected project
- **Outputs:** Stored baseline summary / refreshed baseline details
- **Audit:** Each create/update writes audit entry with `baselineId`, `userId`, `timestamp`, and changed fields

### Packaging
#### Read packaging
- **Operation:** `GET /api/architecture/baselines/{id}/packaging`
- **Purpose:** Retrieve current approved packaging record for a baseline
- **Performance:** Current approved packaging record retrievable within 2 seconds for standard baseline load

#### Update packaging
- **Operation:** `PUT /api/architecture/baselines/{id}/packaging`
- **Purpose:** Save packaging section for baseline
- **Required inputs supported by source:** `packagingApproach`, `version`, `approvalStatus`, baseline identifier, project context
- **Validation/Rules:**
  - Exactly one packaging approach record linked to the baseline identifier and project context
  - Record cannot be marked complete or submitted for approval unless `packagingApproach`, `version`, and `approvalStatus` are populated with non-blank values
  - Blank strings, null values, and baseline/project mismatches rejected with field-level errors
- **Authorization:** Only Desktop Engineer or reviewer role may modify; unauthorized users receive authorization error and no data is created/modified
- **Audit:** Each successful update creates a new versioned audit entry containing `baselineId`, previous/new packaging values, acting user, timestamp, and approval action where applicable

### Deployment Method
#### Read deployment
- **Operation:** `GET /api/architecture/baselines/{id}/deployment`
- **Purpose:** Retrieve deployment method details

#### Update deployment
- **Operation:** `PUT /api/architecture/baselines/{id}/deployment`
- **Purpose:** Save deployment method in architecture baseline
- **Required inputs supported by source:** deployment method, target environment scope, approval state
- **Validation/Rules:**
  - deployment method, target environment scope, and approval state are mandatory
  - incomplete records cannot progress
- **Audit:** approvals and updates captured in immutable audit history

#### Release readiness read
- **Operation:** `GET /api/projects/{projectId}/release-readiness`
- **Purpose:** Downstream reference for release readiness against deployment method

### BRD Baseline
#### Retrieve BRD baseline
- **Operation:** `GET /api/brd/{projectId}`
- **Purpose:** Retrieve BRD baseline metadata for project
- **Response must include:** `document status`, `version`, `sourceBasis`, `project linkage`, and available architecture traceability references

#### Update BRD baseline
- **Operation:** `PUT /api/brd/{projectId}`
- **Purpose:** Save revised BRD baseline metadata
- **Required inputs supported by source:** `status`, `version`, `sourceBasis`, `projectId`
- **Validation/Rules:**
  - required fields must be present
  - `version` format must be non-empty and normalized
  - save rejected if another active baseline version exists for same project requirement set
- **Errors:**
  - validation error when required control fields missing
  - duplicate-version error when save would create second active baseline version
  - authorization failure for unauthorized analyst/reviewer access
- **Audit:** successful update records editor identity, timestamp, and changed fields

#### Traceability
- **Operation:** `GET /api/requirements/{id}/traceability`
- **Purpose:** Expose linked architecture traceability for requirement records and support change/scope governance

### BRD Requirement Records
#### Create/update requirement records
- Endpoint not explicitly named in source
- **Required behavior:**
  - require `sourceRequirementId` before a BRD requirement record can be submitted into controlled baseline workflow
  - validate `sourceRequirementId` against approved source-backed scope items
  - block baseline-controlled persistence when source link is missing, unknown, inactive, or unapproved
  - enforce same validation through direct API requests
- **Display contract:** requirement detail/review view displays linked `sourceRequirementId`

### BRD Requirement History
- Endpoint not explicitly named in source
- **Required behavior:**
  - retrieve history for a specific BRD requirement record by valid requirement identifier
  - return immutable entries in reverse chronological order
  - deny access to users lacking reviewer or audit permission
- **History entry content:** requirement record identifier, actor identity, UTC timestamp, changed field names, previous values, new values, approval state at time of change

### BRD Lifecycle and Review
#### Status transitions
- **Operation:** `POST /api/brds/{id}/status-transitions`
- **Purpose:** Apply BRD lifecycle transition
- **Validation/Rules:**
  - only configured transitions allowed
  - approval states require authorized roles
  - comments required for rejection or supersede actions

#### Versions/history
- **Operations:** `GET /api/brds/{id}/versions`, `GET /api/brds/{id}/history`
- **Purpose:** Retrieve current version and history

#### Review retrieval
- **Operations:** `GET /api/brds/{id}/requirements`, `GET /api/brds/{id}/reviews`
- **Purpose:** Load requirement entries and review state, including pending reviewer assignment and current stage

#### Review action submission
- **Operation:** `POST /api/brds/{id}/reviews/actions`
- **Purpose:** Save review decision
- **Accepted actions:** approve, reject, change request
- **Validation/Rules:**
  - only assigned reviewers at current stage may act
  - reject/change request require non-empty comments
  - prior required stages must be complete before progression
  - BRD id must reference an existing reviewable version
- **Audit:** reviewer identity, action, comments, timestamp, resulting status
- **Notification:** queue a notification to the document owner after save

#### Approval summary and decision
- **Operations:** `GET /api/brds/{id}/approval-summary`, `POST /api/brds/{id}/approval-decisions`
- **Purpose:** Load approval prerequisites and finalize BRD approval/rejection
- **Validation/Rules:**
  - all required reviews and mandatory metadata checks must be complete before baseline activation
  - unauthorized approvers and incomplete review packages are blocked
- **Audit:** final approval/rejection with approver identity, timestamp, and baseline effect

### Change Control
#### Create change request
- **Operation:** `POST /api/change-requests`
- **Purpose:** Record proposed scope additions and integration changes against project baseline
- **Validation/Rules:** source requirement reference and approval state required

#### Approve/reject change request
- **Operation:** `PUT /api/change-requests/{id}/approval`
- **Purpose:** Controlled approval of scope/integration changes
- **Validation/Rules:** changes without source backing cannot be marked approved
- **Audit:** all scope control decisions retained in auditable approval history
- **Traceability:** approved changes update requirement traceability records and remain associated with project baseline

### Integration Compliance
#### Submit integration proposal
- **Operation:** `POST /api/integrations/proposals`
- **Purpose:** Create or progress external integration proposal
- **Validation/Rules:**
  - proposal must reference approved source-backed requirement linked to project BRD baseline
  - missing/invalid/unapproved references are rejected
  - proposal progresses only when referenced requirement has approved scope status
- **Audit:** every blocked or approved compliance check records actor identity, timestamp, proposal identifier, and decision outcome

#### Retrieve integration compliance
- **Operation:** `GET /api/integrations/proposals/{id}/compliance`
- **Purpose:** Display compliance status for integration proposals

### Prerequisites
#### Update prerequisites
- **Operation:** `PUT /api/architecture/baselines/{id}/prerequisites`
- **Purpose:** Save supported Windows client prerequisites
- **Required inputs supported by source:** `supportedWindowsOs`, `runtimeDependencies`
- **Validation/Rules:**
  - `supportedWindowsOs` required
  - at least one runtime dependency entry required
  - blank or whitespace-only runtime dependency entries rejected
  - duplicate dependency name or duplicate dependency name/version combination rejected within same baseline update
- **Audit/History:** successful update creates versioned history record and audit log entry with `baselineId`, `userId`, `timestamp`, changed prerequisite values

### Build Readiness / Finalization
#### Project build readiness
- **Operation:** `GET /api/projects/{id}/build-readiness`
- **Purpose:** Retrieve project-specific build readiness data

#### Evaluate project build readiness
- **Operation:** `POST /api/projects/{id}/build-readiness/evaluate`
- **Purpose:** Evaluate readiness against architecture baseline and related records
- **Validation/Rules:**
  - fail when architecture baseline missing, incomplete, or not approved
  - fail when runtime prerequisites, packaging approach, or deployment method are absent
  - only Release Manager-authorized users may request or view evaluation
- **Audit:** each evaluation stores project identifier, evaluator identity, timestamp, decision result, evaluated condition details

#### Build finalization
- Specific endpoint not named in source
- **Required behavior:**
  - reject finalization when linked BRD is missing, incomplete, or not `Approved`
  - reject finalization when linked architecture baseline is missing, incomplete, or not `Approved`
  - reject completion when architecture baseline scope, client runtime prerequisites, packaging approach, or deployment method are missing or non-approved where required by readiness gate stories
  - build must remain in pre-finalization state when gate fails
  - only authenticated users with build finalization permission may invoke completion action
- **Audit:** every blocked or successful attempt logs build identifier or buildRequestId, user, timestamp, evaluated baseline status, and outcome

### Security and Audit
#### Roles
- **Operation:** `GET /api/security/roles`
- **Purpose:** Retrieve available baseline roles

#### Role assignments
- **Operation:** `PUT /api/security/assignments`
- **Purpose:** Update stakeholder assignment for controlled baseline access

#### Audit logs
- **Operations:** `GET /api/audit-logs`, `POST /api/audit-logs/events`
- **Purpose:** Query filtered audit logs and persist audit events
- **Filtering supported:** actor, object type, date range
- **Authorization:** Security Administrator only for audit log retrieval; non-authorized users cannot retrieve results
- **Security:** authenticated access, encrypted transport, immutable persistence

### Open API Questions
- Endpoint contracts for BRD requirement create/update/read are not explicitly named
- Endpoint contracts for architecture baseline create/update/read beyond referenced examples are not fully specified
- Exact schemas for payloads and responses are not defined in the source
- Idempotency expectations are not explicitly stated for PUT and POST operations

## Business Logic & Rules
- The architecture baseline for specstest must store `applicationType` as `Windows`
- Architecture baseline review submission is invalid if `applicationType`, `projectId`, or `requirementId` is missing
- `requirementId` for architecture baseline must exist in project requirements for the same project
- Only one packaging approach record may exist for a given baseline identifier and project context
- Packaging cannot be marked complete or submitted for approval unless `packagingApproach`, `version`, and `approvalStatus` are non-blank
- Deployment method baseline must exist and be approved before build finalization can proceed
- Deployment method baseline requires deployment method, target environment scope, and approval state
- BRD baseline retrieval must include document status, version, source basis, project linkage, and available architecture traceability references
- BRD baseline update requires `status`, `version`, `sourceBasis`, and `projectId`
- Only one active BRD baseline version may exist for the same project requirement set
- BRD requirement records intended for controlled baseline status must include a valid `sourceRequirementId`
- `sourceRequirementId` must match an approved source-backed scope item and may not be unknown, inactive, or rejected
- BRD requirement history must be immutable, retained after later edits, and reconstruct lineage across metadata, content, and approval-state changes
- BRD lifecycle transitions are restricted to configured paths; comments are required for rejection or supersede actions
- One current approved BRD version must be marked current while superseded versions remain read-only history
- Architecture baseline status values are limited to `Draft`, `Under Review`, `Approved`, and `Superseded`
- Architecture baseline transitions allowed:
  - `Draft -> Under Review`
  - `Under Review -> Approved`
  - `Approved -> Superseded`
- Direct `Draft -> Approved` architecture transition is invalid
- Stakeholder review actions allowed only for users assigned to the current BRD review stage
- `reject` and `change request` review actions require comments; blank comments preserve existing workflow status
- Final BRD approval may occur only after required reviews and mandatory metadata checks are complete
- Scope additions and integration changes cannot be approved without source-backed requirement linkage
- Approved scope changes update requirement traceability records and remain linked to the specstest project baseline
- External integration proposals must reference an approved source-backed requirement linked to the project BRD baseline before progressing
- Unsupported integration assumptions must be flagged during baseline review and excluded from approved architecture baseline
- Supported Windows prerequisites require:
  - non-empty `supportedWindowsOs`
  - at least one runtime dependency entry
  - no blank/whitespace-only entries
  - no duplicate dependency name
  - no duplicate dependency name/version combination within one update
- Runtime prerequisite security review stores component name, version, security review outcome, and elevated-rights requirement
- Security review outcome values are limited to `Compliant`, `Compliant with Exception`, and `Non-Compliant`
- If a prerequisite requires elevated installation rights or restricted endpoint exception, reviewer comment must explain the condition
- Build finalization/build approval must be blocked when:
  - BRD is missing, incomplete, or not approved
  - architecture baseline is missing, incomplete, or not approved
  - required architecture baseline elements are missing or not approved, including architecture scope, runtime prerequisites, packaging approach, and deployment method where applicable
  - prerequisite readiness is missing or any prerequisite is pending, undefined, rejected, missing, or unapproved
- Build finalization failure must leave the build in its pre-finalization state
- Build gate/readiness evaluations and denied protected actions must be audit logged
- Protected baseline actions require authenticated access and encrypted transport
- Authorization checks for protected endpoints must complete within 500 ms for standard requests

## Data Model & Validation
### Architecture Baseline
Source-supported fields:
- `baselineId`
- `projectId`
- `requirementId`
- `applicationType`
- `status`
- packaging section data
- deployment method data
- prerequisites data
- architecture scope status/evidence as referenced by readiness gates
- project linkage
- approval metadata/history references

Validation:
- `applicationType` must be `Windows`
- `projectId` required
- `requirementId` required and must belong to project
- status values limited to `Draft`, `Under Review`, `Approved`, `Superseded`
- invalid transitions rejected
- null, empty, draft, rejected, or pending-approval architecture elements fail readiness gate where specified

### Packaging Record
Source-supported fields:
- `baselineId`
- project context
- `packagingApproach`
- `version`
- `approvalStatus`

Audit/history fields:
- previous packaging values
- new packaging values
- acting user
- timestamp
- approval action

Validation:
- exactly one record per baseline/project context
- required non-blank `packagingApproach`, `version`, `approvalStatus`
- reject blank strings, nulls, baseline/project mismatches

### Deployment Method Record
Source-supported fields:
- deployment method
- target environment scope
- approval state
- project linkage / baseline linkage

Validation:
- mandatory deployment method
- mandatory target environment scope
- mandatory approval state
- incomplete records cannot progress

### BRD Baseline
Source-supported fields:
- `projectId`
- `status`
- `version`
- `sourceBasis`
- project linkage
- architecture traceability references
- active/current version indicator

Audit/history fields:
- editor identity
- timestamp
- changed fields

Validation:
- all required control fields present on save
- version non-empty and normalized
- no second active baseline version for same project requirement set

### BRD Requirement Record
Source-supported fields:
- requirement record identifier
- requirement title or statement
- detailed content
- source information
- `sourceRequirementId`
- workflow status
- version number
- baseline indicator
- approval state

Validation:
- `sourceRequirementId` required for baseline-controlled records
- `sourceRequirementId` must reference approved source-backed scope item
- inactive, unknown, rejected, or unapproved source identifiers rejected
- server-side enforcement must prevent bypass via direct API requests

### BRD Requirement History Entry
Source-supported fields:
- `requirementRecordId`
- actor identity
- UTC timestamp
- changed field names
- previous values
- new values
- approval state at time of change

Validation:
- only persisted changes produce history entry
- timestamps normalized to UTC
- valid requirement identifier required for retrieval
- stored entries immutable and retained unchanged after later updates

### Architecture Baseline Status History
Source-supported fields:
- reviewer identity
- previous status
- new status
- change timestamp

Validation:
- reviewer identity required
- only defined statuses and transition paths accepted

### Runtime Prerequisite Baseline
Source-supported fields:
- `supportedWindowsOs`
- runtime dependency entry / entries
- dependency name
- dependency version where applicable
- version history metadata

Validation:
- `supportedWindowsOs` required
- at least one runtime dependency required
- no blank or whitespace-only entries
- no duplicate dependency name
- no duplicate dependency name/version combination in same update

### Runtime Prerequisite Security Review
Source-supported fields:
- prerequisite component name
- version
- enterprise security review outcome
- `elevatedInstallationRightsRequired`
- restricted endpoint exception flag
- reviewer comment
- reviewer attribution
- review timestamp
- baseline approval evidence linkage

Validation:
- component name required
- version required
- review outcome required and constrained to controlled values
- explicit boolean values required where applicable
- comment required when elevated rights or restricted endpoint exception condition applies

### Change Request / Integration Proposal
Source-supported fields:
- proposal/change request identifier
- source requirement reference
- approval state
- project baseline association
- decision outcome
- actor identity
- timestamp

Validation:
- source requirement reference required
- unsupported references cannot be approved
- external integration proposal must reference approved source-backed requirement linked to project BRD baseline

### Audit Event / Audit Log
Source-supported fields:
- actor identity / actorId
- actor role
- UTC timestamp
- object type
- object identifier / objectId
- action
- outcome
- changed field details where applicable
- correlationId
- request path where logged
- decision result / latency where applicable

Validation:
- immutable persistence
- no update/delete operations on audit rows
- denied modification attempts must also be logged where specified

### Open Data Questions
- Source does not define all free-text metadata fields for architecture scope, deployment support considerations, or review comments storage shape
- Source does not define exact version formatting rules beyond non-empty and normalized
- Source does not define retention period except history support for 12 months on BRD history retrieval

## Functional Requirements
1. The system shall allow authorized users to create and update an architecture baseline for specstest that stores `applicationType = Windows` and the associated `projectId`.
2. The system shall reject architecture baseline review submission when `applicationType`, `projectId`, or `requirementId` is missing.
3. The system shall validate that the selected architecture baseline `requirementId` exists in the project requirements returned for the same project.
4. The system shall write an audit entry for each architecture baseline create or update containing `baselineId`, `userId`, `timestamp`, and changed fields.
5. The system shall store exactly one packaging approach record per baseline identifier and project context.
6. The system shall prevent packaging completion or approval submission unless `packagingApproach`, `version`, and `approvalStatus` are populated with non-blank values.
7. The system shall reject packaging updates with blank strings, null values, or baseline/project mismatches using field-level validation errors.
8. The system shall return an authorization error and persist no packaging changes when a user without Desktop Engineer or reviewer role calls the packaging update operation.
9. The system shall create a versioned audit entry for each successful packaging update containing `baselineId`, previous values, new values, acting user, timestamp, and approval action where applicable.
10. The system shall allow retrieval of the current approved packaging record for a standard specstest baseline load within 2 seconds.
11. The system shall persist the Windows deployment method in the architecture baseline linked to the specstest project.
12. The system shall require deployment method, target environment scope, and approval state before a deployment method record can progress.
13. The system shall prevent build finalization when the deployment method baseline is missing or not approved.
14. The system shall capture deployment method approvals and updates in immutable audit history.
15. The system shall retrieve the BRD baseline by project and include document status, version, sourceBasis, project linkage, and any available architecture traceability references.
16. The system shall reject BRD baseline updates when status, version, sourceBasis, or project linkage is missing.
17. The system shall prevent creation of a second active BRD baseline version for the same project requirement set and return a duplicate-version error.
18. The system shall record an audit entry for each successful BRD baseline update containing editor identity, timestamp, and changed fields.
19. The system shall return an authorization failure and persist no BRD baseline update when the user lacks the authorized analyst or reviewer role.
20. The system shall require `sourceRequirementId` when creating or updating a BRD requirement record that is to be submitted into the controlled baseline workflow.
21. The system shall validate that `sourceRequirementId` matches an approved source-backed scope item before saving a BRD requirement as baseline-eligible.
22. The system shall display the linked `sourceRequirementId` on the BRD requirement detail/review view.
23. The system shall block save and return a specific validation error when `sourceRequirementId` is unknown, unapproved, or inactive.
24. The system shall prevent persistence of BRD requirement records in baseline-controlled status when no valid source requirement link exists, including through direct API requests.
25. The system shall create an immutable BRD requirement history entry whenever content, metadata, or approval state changes on a persisted record.
26. The system shall store each BRD requirement history entry with requirement identifier, actor identity, UTC timestamp, changed field names, previous values, new values, and approval state snapshot.
27. The system shall allow only authorized audit or reviewer users to retrieve BRD requirement history.
28. The system shall deny unauthorized BRD requirement history access without exposing change details.
29. The system shall display BRD requirement history in reverse chronological order in a read-only timeline.
30. The system shall retain all BRD requirement history entries unchanged after subsequent edits.
31. The system shall permit only configured BRD lifecycle transitions based on current state and assigned role.
32. The system shall mark one current approved BRD version for the project and preserve superseded versions in read-only history.
33. The system shall capture status transition comments, actor identity, timestamp, and prior/new state values for every BRD lifecycle change.
34. The system shall require comments for BRD rejection or supersede actions.
35. The system shall display BRD review content to assigned Stakeholder Reviewers with requirement entries, document metadata, and current workflow status for the selected version.
36. The system shall accept approve, reject, and change request review actions only from users assigned to the current BRD review stage.
37. The system shall block reject and change request review actions when comments are blank and preserve the current workflow status.
38. The system shall, on valid review action, update the reviewer decision, recalculate BRD review status, record reviewer identity/action/comments/timestamp/resulting status in audit history, and queue notification to the document owner.
39. The system shall activate a BRD version as the project baseline only after all required reviews and mandatory metadata checks are complete.
40. The system shall prevent unauthorized approvers or incomplete review packages from finalizing BRD approval.
41. The system shall record final BRD approval or rejection outcome with approver identity, timestamp, and baseline effect in the audit trail.
42. The system shall store supported Windows prerequisites with `supportedWindowsOs` and at least one runtime dependency entry.
43. The system shall reject prerequisite updates when `supportedWindowsOs` is empty, any runtime dependency is blank, or any runtime dependency contains only whitespace.
44. The system shall prevent duplicate prerequisite entries by duplicate dependency name or duplicate dependency name/version combination within the same baseline update.
45. The system shall create a versioned history record and audit log entry for each successful prerequisite update containing `baselineId`, `userId`, `timestamp`, and changed prerequisite values.
46. The system shall store runtime prerequisite security review records with component name, version, enterprise security review outcome, and elevated-installation-rights requirement.
47. The system shall require a security review outcome from the controlled values `Compliant`, `Compliant with Exception`, or `Non-Compliant` before prerequisite review completion.
48. The system shall require reviewer comment when a prerequisite requires elevated installation rights or restricted endpoint exception.
49. The system shall make the runtime prerequisite security review outcome retrievable as evidence linked to Windows application baseline approval.
50. The system shall deny create/update of runtime prerequisite review outcomes to users without security review permission.
51. The system shall require a recorded prerequisite readiness status before final build approval can be completed.
52. The system shall block final build approval and display blocking prerequisite entries when any documented client runtime prerequisite is missing, pending, unapproved, rejected, or undefined.
53. The system shall store prerequisite readiness evidence references with the architecture baseline, including prerequisite name, status, approver, and approval timestamp.
54. The system shall allow only authenticated users with release approval permissions to update prerequisite readiness status or complete the final approval step.
55. The system shall show the current baseline of client runtime prerequisites associated with the Windows application release being approved.
56. The system shall present packaging approach and deployment method together in a single controlled architecture baseline section for operational reference.
57. The system shall identify support-relevant deployment considerations for installation, update, and recovery scenarios.
58. The system shall make approved packaging and deployment information accessible to release and support stakeholders before build finalization.
59. The system shall enforce architecture baseline review status values limited to `Draft`, `Under Review`, `Approved`, and `Superseded`.
60. The system shall persist architecture baseline status changes with reviewer identity, previous status, new status, and timestamp.
61. The system shall allow architecture status transitions only from `Draft` to `Under Review`, `Under Review` to `Approved`, and `Approved` to `Superseded`, and reject direct `Draft` to `Approved`.
62. The system shall expose the current architecture baseline status and a build gate indicator that is `Ready` only when the latest architecture baseline status is `Approved`.
63. The system shall return an authorization error when a user without architecture review or project reporting access attempts to change architecture review status or retrieve the build gate report.
64. The system shall block approval of scope additions and integration changes when no source-backed requirement is linked.
65. The system shall update requirement traceability records and retain project baseline association when scope additions or integration changes are approved.
66. The system shall retain all scope control decisions in auditable approval history.
67. The system shall identify and flag external integration content during baseline review when it is not supported by an approved source requirement.
68. The system shall exclude unsupported integration assumptions from the approved Windows application architecture baseline.
69. The system shall retain traceability evidence showing that approved integration scope was validated against formal requirement control.
70. The system shall reject external integration proposals that do not reference an approved source-backed requirement linked to the project BRD baseline.
71. The system shall allow an external integration proposal to progress only when the referenced requirement has approved scope status.
72. The system shall record every blocked or approved integration compliance check with actor identity, timestamp, proposal identifier, and decision outcome.
73. The system shall enforce RBAC for viewing, creating, updating, and approving requirement, architecture, and deployment baseline records.
74. The system shall return authorization errors and persist no changes for unauthorized modification requests on controlled baseline records.
75. The system shall write immutable audit events for protected baseline record create, update, approve, and denied modification attempts including required actor, role, object, action, timestamp, outcome, and changed-field details where applicable.
76. The system shall allow Security Administrator users to retrieve audit logs filtered by actor, object type, and date range.
77. The system shall deny audit log retrieval to non-authorized users.
78. The system shall require authenticated access and encrypted transport for protected security and audit endpoints.
79. The system shall complete authorization checks for standard protected requests within 500 milliseconds.
80. The system shall protect BRD and architecture baseline data in transit and at rest using enterprise-approved encryption.
81. The system shall capture API and application security events including failed authorization, invalid input attempts, and rate-limit breaches for compliance monitoring.
82. The system shall reject build finalization when the linked BRD record is missing, incomplete, or not in `Approved` status and return a blocking reason identifying the BRD condition.
83. The system shall reject build finalization when the linked architecture baseline is missing, incomplete, or not in `Approved` status and return a blocking reason identifying the architecture condition.
84. The system shall show separate BRD approval and architecture approval statuses in the build readiness view, with each non-ready state identifying the specific record state.
85. The system shall create an immutable audit entry for every build gate evaluation containing projectId, buildRequestId or buildId, evaluated BRD status, evaluated architecture status, gate outcome, timestamp, and acting user identity.
86. The system shall keep a build in its pre-finalization state when build finalization is attempted while either required governance record is not ready.
87. The system shall block build finalization when the linked architecture baseline record is missing, incomplete, or lacks approval for the selected project.
88. The system shall list each failed architecture readiness condition separately, including missing or unapproved runtime prerequisites, packaging approach, and deployment method data.
89. The system shall return a pass result from readiness evaluation only when all required architecture baseline conditions are satisfied.
90. The system shall allow only authorized Release Manager users to request or view build readiness evaluations.
91. The system shall block build finalization completion when architecture baseline approval status is not `Approved`.
92. The system shall evaluate documented architecture scope, client runtime prerequisites, packaging approach, and deployment method before allowing build finalization completion.
93. The system shall return a blocking message naming each missing or unapproved architecture baseline element when build finalization is blocked.
94. The system shall allow only authenticated users with build finalization permission to attempt build completion and deny unauthorized attempts without changing build status.
95. The system shall audit every blocked or successful build finalization attempt with build identifier, user, timestamp, evaluated baseline status, and outcome.
96. The system shall provide a standardized read-only BRD review format that shows title or statement, detailed content, source information, workflow status, version number, and baseline indicator in the same field order for every entry.
97. The system shall visually distinguish `Draft`, `In Review`, and `Approved` BRD entries with explicit status labels and not rely on color alone.
98. The system shall mark exactly one approved baseline version as current when multiple versions exist for the same BRD entry and label superseded versions as non-active.
99. The system shall display a clear incomplete-entry message naming any missing required BRD metadata needed for the standardized review format.
100. The system shall complete baseline retrieval, baseline save, packaging operations, deployment operations, BRD retrieval/save, prerequisite retrieval/save, review submissions, approval summaries/decisions, change control operations, integration compliance checks, and readiness evaluations within the source-stated 2-second thresholds for standard requests.

## Non-Functional Requirements
### Performance
- Architecture baseline retrieval and save shall complete within 2 seconds for standard project records
- Packaging GET and PUT operations shall complete within 2 seconds for standard baseline loads
- Deployment baseline updates and lookups shall complete within 2 seconds for standard usage
- BRD retrieval and save shall complete within 2 seconds for standard BRD payload sizes
- BRD review action submission shall persist within 2 seconds for valid submissions
- BRD approval summary load and approval decision persistence shall each complete within 2 seconds
- Change request create/approval operations shall complete within 2 seconds for standard transactions
- Integration compliance validation shall complete within 2 seconds for a single proposal
- Build readiness evaluation shall complete within 2 seconds for a single project under normal load
- Authorization checks for protected API requests shall complete within 500 ms for standard requests
- Audit log retrieval shall return standard filtered results within 2 seconds
- Notification dispatch after BRD review action shall be queued within 30 seconds and not executed inline

### Security
- Protected baseline, security, audit, readiness, and approval actions require authenticated access
- RBAC must be enforced server-side based on assigned roles and current workflow/stage constraints where applicable
- Unauthorized actions must not persist state changes
- Protected endpoints must use encrypted transport
- BRD and architecture baseline repository data must be protected at rest using enterprise-approved encryption
- Clients must not be able to spoof reviewer identity in review actions
- Audit records/history rows must be append-only/immutable and protected from update/delete through service and database constraints where specified
- Metadata text input and integration metadata must be sanitized where specified

### Reliability and Data Integrity
- Immutable audit and history entries must remain unchanged after subsequent edits
- Build finalization must never persist `Finalized` when gates fail
- Exactly one active BRD baseline version per project requirement set must be enforced
- Exactly one current approved baseline version for a BRD entry must be identifiable in review
- Packaging must maintain exactly one packaging approach record per baseline/project context

### Accessibility
- BRD review statuses must not rely on color alone
- Explicit labels are required for status communication

### Observability
- Structured logs shall capture correlation IDs for packaging updates, BRD updates, history retrieval, status changes, review submissions, security events, and readiness evaluations where specified
- Observability shall capture request latency, validation failures, duplicate-version rejection events, authorization failures, audit-write outcomes, pass/fail reason codes, and missing-field details as specified by source stories
- Security monitoring shall capture failed authorization, invalid input attempts, and rate-limit breaches

### Operational
- BRD history retrieval shall support 12 months of changes without timeout
- Current status and gate indicators should be returned using efficient query paths suited to project reporting and review flows

## Acceptance Scenarios
### 1. Create Windows architecture baseline successfully
**Given** a Solution Architect is authenticated and authorized  
**And** the selected `requirementId` exists in the project requirements for the same `projectId`  
**When** the architect saves the architecture baseline with `applicationType = Windows`, `projectId`, and `requirementId`  
**Then** the system persists the architecture baseline  
**And** stores `applicationType` as `Windows`  
**And** links the record to the provided `projectId`  
**And** writes an audit entry with `baselineId`, `userId`, `timestamp`, and changed fields.

### 2. Reject architecture baseline review submission when required fields are missing
**Given** a user is editing the architecture baseline  
**When** the user submits the baseline for review without `applicationType`, `projectId`, or `requirementId`  
**Then** the system rejects the submission  
**And** returns a validation error identifying the missing required field(s).

### 3. Save packaging record successfully
**Given** a Desktop Engineer is authenticated and authorized  
**And** a specstest architecture baseline exists  
**When** the engineer saves packaging data with non-blank `packagingApproach`, `version`, and `approvalStatus` for the baseline and project context  
**Then** the system stores exactly one packaging approach record for that baseline/project context  
**And** records a versioned audit entry with baselineId, previous/new values, acting user, timestamp, and approval action where applicable.

### 4. Reject unauthorized packaging update
**Given** a user without Desktop Engineer or reviewer role is authenticated  
**When** the user calls the packaging update operation  
**Then** the system returns an authorization error  
**And** does not create or modify packaging data  
**And** records the denied attempt when required by security audit rules.

### 5. Retrieve approved packaging record
**Given** a current approved packaging record exists for the baseline  
**When** an authorized user requests packaging for a standard specstest baseline load  
**Then** the system returns the current approved packaging record within 2 seconds.

### 6. Save deployment method successfully
**Given** a Deployment Manager is authenticated and authorized  
**When** the manager submits deployment method details with deployment method, target environment scope, and approval state  
**Then** the system saves the deployment method in the architecture baseline  
**And** links it to the specstest project  
**And** captures immutable audit history for the update.

### 7. Reject incomplete deployment method progression
**Given** a deployment method record is being progressed  
**When** deployment method, target environment scope, or approval state is missing  
**Then** the system blocks progression  
**And** returns a validation error.

### 8. Retrieve BRD baseline successfully
**Given** a BRD baseline exists for the specstest project  
**When** an authorized user retrieves the BRD baseline by project  
**Then** the response includes document status, version, sourceBasis, project linkage, and any available architecture traceability references.

### 9. Reject duplicate active BRD baseline version
**Given** an active BRD baseline version already exists for a project requirement set  
**When** a user attempts to save another active baseline version for the same set  
**Then** the system rejects the save  
**And** returns a duplicate-version error  
**And** does not create a second active version.

### 10. Save BRD requirement with valid source requirement link
**Given** a Business Analyst is authenticated  
**And** an approved source-backed scope item exists  
**When** the analyst creates or updates a BRD requirement record with a valid `sourceRequirementId`  
**Then** the system saves the requirement as baseline-eligible  
**And** displays the linked source requirement identifier in the requirement detail/review view.

### 11. Reject BRD requirement with invalid source requirement link
**Given** a BRD requirement is being created or updated for baseline-controlled status  
**When** the provided `sourceRequirementId` is missing, unknown, inactive, or unapproved  
**Then** the system blocks the save  
**And** returns a specific validation error for that identifier  
**And** does not persist the requirement in baseline-controlled status.

### 12. Record BRD requirement history on change
**Given** an existing BRD requirement record exists  
**When** an authorized user changes requirement content, metadata, or approval state  
**Then** the system stores a new immutable history entry containing the record identifier, actor identity, UTC timestamp, changed fields, previous values, new values, and approval state snapshot.

### 13. Retrieve BRD requirement history in read-only reverse chronological order
**Given** an Audit Manager is authenticated and authorized  
**And** a BRD requirement has change history  
**When** the Audit Manager opens the change history for that requirement  
**Then** the system displays entries in reverse chronological order  
**And** includes metadata, content, and approval-state changes in a single timeline  
**And** provides no controls to edit or delete history entries.

### 14. Deny unauthorized BRD requirement history retrieval
**Given** a user lacks reviewer or audit permission  
**When** the user requests BRD requirement history  
**Then** the system returns an authorization error  
**And** exposes no change details.

### 15. Perform valid BRD lifecycle transition
**Given** a Requirements Manager is authenticated and authorized  
**And** a BRD is in a state with a configured next transition  
**When** the manager selects a valid transition and provides required comments where applicable  
**Then** the system updates the BRD state  
**And** records actor identity, timestamp, prior state, new state, and comments  
**And** preserves prior approved versions as history if superseded.

### 16. Reject invalid architecture baseline status transition
**Given** an architecture baseline is in `Draft` status  
**When** an authorized user attempts to set the status directly to `Approved`  
**Then** the system rejects the request  
**And** returns a validation error  
**And** does not persist the invalid transition.

### 17. Submit BRD review action successfully
**Given** a Stakeholder Reviewer is authenticated  
**And** is assigned to the current BRD review stage  
**And** the selected BRD version is in review  
**When** the reviewer submits an approve action  
**Then** the system records the reviewer decision  
**And** recalculates the BRD review status  
**And** writes immutable audit evidence with reviewer identity, action, comments if provided, timestamp, and resulting status  
**And** queues notification to the document owner  
**And** displays the recorded decision in review history.

### 18. Reject BRD review reject/change request without comments
**Given** a Stakeholder Reviewer is assigned to the current review stage  
**When** the reviewer submits a reject or change request action with blank comments  
**Then** the system blocks the submission  
**And** preserves the current workflow status until valid comments are provided.

### 19. Finalize BRD approval successfully
**Given** an Approval Manager is authenticated and authorized  
**And** all required reviews are complete  
**And** mandatory metadata checks pass  
**When** the approver submits a final approval decision  
**Then** the system activates the BRD version as the project baseline  
**And** records approver identity, timestamp, and baseline effect in the audit trail.

### 20. Reject BRD final approval when prerequisites are incomplete
**Given** a BRD approval package has missing required reviews or mandatory metadata  
**When** an approver attempts to finalize approval  
**Then** the system blocks finalization  
**And** does not activate the BRD as the project baseline.

### 21. Save prerequisites successfully
**Given** a Release Manager is authenticated and authorized  
**When** the manager saves prerequisites with non-empty `supportedWindowsOs` and at least one non-blank runtime dependency entry  
**And** no duplicate dependency name or duplicate name/version combination exists in the update  
**Then** the system stores the prerequisites  
**And** creates a versioned history record and audit log entry with changed prerequisite values.

### 22. Reject invalid prerequisite update
**Given** a prerequisite update is being submitted  
**When** `supportedWindowsOs` is empty, a runtime dependency is blank or whitespace-only, or a duplicate entry exists in the request  
**Then** the system rejects the update  
**And** does not persist the invalid prerequisites.

### 23. Save runtime prerequisite security review successfully
**Given** an Information Security Analyst is authenticated and authorized  
**When** the analyst records component name, version, valid review outcome, and elevated-rights/exception flags with required comment where applicable  
**Then** the system stores the review  
**And** links the outcome to baseline approval evidence retrieval.

### 24. Reject unauthorized runtime prerequisite security review update
**Given** a user lacks security review permission  
**When** the user attempts to create or update runtime prerequisite security review outcomes  
**Then** the system returns an authorization error  
**And** does not persist the update.

### 25. Approve scope change with source-backed requirement
**Given** a Project Manager is authenticated and authorized  
**And** a change request includes a valid source-backed requirement reference  
**When** the request is approved  
**Then** the system updates requirement traceability records  
**And** keeps the approved change associated with the specstest project baseline  
**And** stores the decision in auditable approval history.

### 26. Block unsupported scope or integration change
**Given** a scope addition or integration change lacks a source-backed requirement link  
**When** a user attempts to approve it  
**Then** the system blocks approval  
**And** returns validation feedback  
**And** does not include the change in approved baseline scope.

### 27. Reject unsupported external integration proposal
**Given** an Enterprise Architect is authenticated and authorized  
**When** the architect submits an external integration proposal without a referenced approved source-backed requirement linked to the project BRD baseline  
**Then** the system rejects the proposal  
**And** records the blocked compliance check with actor identity, timestamp, proposal identifier, and decision outcome.

### 28. Allow supported external integration proposal to progress
**Given** an external integration proposal references an approved source-backed requirement with approved scope status  
**When** the compliance check is performed  
**Then** the system allows the proposal to progress  
**And** records the approved compliance check in audit history.

### 29. Enforce build readiness gate on BRD and architecture approval
**Given** a Project Manager opens build readiness for a project  
**When** the user requests a readiness check or build finalization  
**And** the linked BRD is missing, incomplete, pending review, rejected, or not approved  
**Or** the linked architecture baseline is missing, incomplete, pending review, rejected, or not approved  
**Then** the system blocks finalization  
**And** shows separate BRD and architecture statuses with specific blocking reasons  
**And** keeps the build in its pre-finalization state  
**And** writes an immutable audit entry for the gate evaluation.

### 30. Enforce architecture readiness gate on prerequisites, packaging, and deployment
**Given** a Release Manager opens project build readiness  
**When** the readiness evaluation runs  
**And** runtime prerequisites, packaging approach, or deployment method data is missing or unapproved  
**Then** the system returns a failed readiness result  
**And** lists each failed condition separately  
**And** stores an audit entry with project identifier, evaluator identity, timestamp, decision result, and evaluated condition details.

### 31. Allow build finalization when all governance conditions pass
**Given** the linked BRD is approved and complete  
**And** the linked architecture baseline is approved and complete  
**And** architecture scope, runtime prerequisites, packaging approach, and deployment method are documented and approved as required  
**And** prerequisite readiness is recorded with no blocking prerequisite entries  
**When** an authorized user finalizes the build  
**Then** the system allows the normal completion path to continue  
**And** writes an audit entry for the successful finalization attempt.

### 32. Deny unauthorized protected action and log the attempt
**Given** a user lacks role permission for a protected baseline action  
**When** the user attempts to create, update, approve, or finalize a controlled record  
**Then** the system returns an authorization error  
**And** does not persist changes  
**And** records the denied modification attempt in the audit log with attempted action, target object, actor identity, timestamp, and denial outcome.

### 33. Retrieve filtered audit logs as Security Administrator
**Given** a Security Administrator is authenticated and authorized  
**When** the administrator requests audit logs filtered by actor, object type, and date range  
**Then** the system returns filtered audit results  
**And** denies the same request for non-authorized users.

### 34. Render standardized BRD review format
**Given** a Stakeholder Reviewer opens a BRD entry in review mode  
**When** all required display metadata is present  
**Then** the system renders the entry in a fixed read-only layout showing requirement title or statement, detailed content, source information, workflow status, version number, and baseline indicator in the same field order  
**And** clearly labels status without relying on color alone.

### 35. Show incomplete-entry message for missing BRD review metadata
**Given** a Stakeholder Reviewer opens a BRD entry  
**When** required metadata for the standardized review format is missing  
**Then** the system displays a clear incomplete-entry message identifying the missing field  
**And** does not render a partial unlabeled layout.

## Traceability Matrix
| Source ID | Requirement | Acceptance Criteria | Test Coverage |
|---|---|---|---|
| US 56827 | FR-1 to FR-4 | applicationType Windows persisted; required fields enforced; requirementId validated by project; audit entry written; 2-second save/retrieve | Architecture baseline create/update tests, validation tests, audit tests, performance tests |
| US 56843 | FR-5 to FR-10 | one packaging record; required fields for completion/submission; unauthorized update blocked; versioned audit entry; read endpoint within 2 seconds | Packaging CRUD tests, RBAC tests, audit tests, performance tests |
| US 56851 | FR-11 to FR-14 | deployment method documented and linked; build finalization blocked if missing/unapproved; audit history captured; required inputs validated | Deployment baseline tests, readiness gate tests, audit tests |
| US 56859 | FR-15 to FR-19 | BRD retrieval fields included; missing fields rejected; duplicate active baseline blocked; audit entry written; unauthorized update denied | BRD baseline tests, duplicate-version tests, RBAC tests, audit tests |
| US 56932 | FR-20 to FR-24 | sourceRequirementId required; approved source validation; identifier displayed; invalid identifier blocked; API bypass prevented | BRD requirement validation tests, display tests, direct API negative tests |
| US 56940 | FR-25 to FR-30 | immutable history entry created; reverse chronological read-only timeline; unauthorized access denied; metadata/content/state changes combined; entries retained unchanged | BRD history tests, RBAC tests, immutability tests |
| US 56883 | FR-31 to FR-34 | only configured BRD transitions; one current approved version; transition comments/actor/timestamp captured; required comments validated | BRD lifecycle tests, versioning tests, transition validation tests |
| US 56891 | FR-35 to FR-38 | review view displays requirements/metadata/status; only assigned reviewers act; reject/change request require comments; decision updates status, audit, notification | BRD review workflow tests, stage-assignment tests, notification queue tests |
| US 56899 | FR-39 to FR-41 | baseline activation only after required reviews/metadata; unauthorized/incomplete finalization blocked; audit trail captured | BRD approval finalization tests, negative authorization tests |
| US 56835 | FR-42 to FR-45 | supportedWindowsOs and runtime dependency required; blank/whitespace rejected; duplicate prerequisites blocked; versioned history and audit written; 2-second operations | Prerequisite persistence tests, validation tests, history/audit tests, performance tests |
| US 56973 | FR-46 to FR-50 | component fields stored; controlled review outcomes required; comment required for elevated rights/exception; review evidence retrievable; unauthorized update denied | Security review tests, controlled-values tests, evidence retrieval tests, RBAC tests |
| US 56981 | FR-51 to FR-55 | prerequisite readiness required before final build approval; missing/pending/unapproved prerequisites block approval; evidence references stored; release approval permissions enforced; readiness view shows current baseline prerequisites | Final build approval gate tests, evidence tests, RBAC tests |
| US 56989 | FR-56 to FR-58 | packaging and deployment shown together; support-relevant deployment considerations identified; approved info accessible before build finalization | Architecture section rendering tests, stakeholder access tests |
| US 56965 | FR-59 to FR-63 | controlled architecture statuses only; status history persisted; valid transitions only; build gate indicator ready only when approved; unauthorized access denied | Architecture status lifecycle tests, reporting tests, RBAC tests |
| US 56867 | FR-64 to FR-66 | no approval without source-backed requirement; approved changes update traceability and stay associated to baseline; auditable approval history retained | Change control approval tests, traceability update tests, audit tests |
| US 57006 | FR-67 to FR-69 | unsupported integration content flagged; excluded from approved baseline; approved baseline retains traceability evidence | Baseline review validation tests, traceability evidence tests |
| US 56916 | FR-70 to FR-72 | unsupported integration proposals rejected; only approved-scope references progress; all compliance checks audited | Integration proposal compliance tests, audit tests |
| US 56875 | FR-73 to FR-79 | RBAC enforced; unauthorized modifications denied without persistence; immutable audit events for protected and denied actions; audit logs filterable for Security Administrator; authenticated/encrypted access; auth checks within 500 ms | Security authorization tests, denied-write tests, audit-log filter tests, performance tests |
| US 56956 | FR-80 to FR-81 | encryption in transit and at rest; audit reporting on controlled record actions; security events captured including failed authorization, invalid input, and rate-limit breaches | Security control tests, audit reporting tests, security event logging tests |
| US 56948 | FR-82 to FR-86 | build finalization blocked for missing/incomplete/unapproved BRD or architecture; statuses shown separately; audit entry created; pre-finalization state preserved | Build readiness gate tests, status-display tests, audit tests |
| US 56907 | FR-87 to FR-90 | architecture gate blocks on missing/incomplete/unapproved baseline; failed conditions itemized; pass only when all satisfied; Release Manager authorization enforced | Architecture readiness evaluation tests, itemized failure tests, RBAC tests |
| US 56998 | FR-91 to FR-95 | finalization blocked unless architecture approved; required baseline elements evaluated; blocking message names missing/unapproved elements; build finalization permission enforced; all attempts audited | Build finalization gate tests, permission tests, audit tests |
| US 56924 | FR-96 to FR-99 | standardized fixed-field-order review format; explicit non-color-only status labels; one current approved version marked; incomplete-entry message shown for missing metadata | BRD review rendering tests, accessibility tests, version-label tests |
| Multiple source stories | FR-100 | source-stated 2-second performance expectations across baseline, review, readiness, and approval operations | End-to-end performance tests, API latency tests |

## Open Questions
1. What is the exact project identifier value or canonical project context identifier for specstest across all APIs and records?
2. What is the exact API endpoint for creating, updating, and retrieving individual BRD requirement records?
3. What is the exact API endpoint for retrieving BRD requirement history?
4. What are the exact request/response schemas for architecture baseline, packaging, deployment, BRD baseline, BRD requirement, prerequisite, readiness, and audit APIs?
5. What are the exact allowed `approvalStatus` values for packaging and deployment records?
6. What are the exact mandatory metadata fields described as “any required project-linked metadata” for packaging?
7. What are the exact fields that define “architecture scope” for build-finalization gate evaluation?
8. What are the exact fields required to document “support-relevant deployment considerations for installation, update, and recovery scenarios”?
9. What are the exact BRD lifecycle states and transition rules beyond the examples `draft`, `under review`, `approved`, and `superseded`? Is `rejected` a formal BRD document status or only a review/approval outcome?
10. What are the exact architecture baseline approval workflow roles and assignment rules, since some stories refer to reviewers generically?
11. What are the exact permissions for read access to BRD, architecture, deployment, prerequisite, and audit data by each actor?
12. What are the exact payload requirements for change request approval details and integration proposal metadata?
13. What is the required retention period for audit logs and immutable history beyond the stated ability to retrieve 12 months of BRD history?
14. What is the exact definition of “complete” for BRD baseline and architecture baseline outside the explicitly listed required fields?
15. What is the exact endpoint or transaction contract for build finalization and final build approval?
16. What is the exact representation of runtime dependency entries: name only, name/version pairs, or structured objects in all cases?
17. What are the exact normalization rules for BRD version values?
18. What is the exact notification payload and delivery mechanism for document owner notifications after BRD review actions?
19. Are view actions on controlled records required to be audit logged universally, or only included in audit reports where captured by the repository/security controls?
20. What are the specific enterprise-approved encryption standards referenced for data in transit and at rest?

## Source References
- Feature ID 56807 — Windows Application Baseline for specstest
- US 56810 — Windows Application Foundation
- US 56827 — Define specstest desktop application as a Windows application
- US 56835 — Record supported Windows client prerequisites
- US 56843 — Document Windows packaging approach
- US 56851 — Define Windows deployment method
- US 56859 — Maintain BRD as authoritative requirement baseline
- US 56867 — Control scope additions and integration changes
- US 56875 — Enforce role-based access and audit logging
- US 56883 — Manage BRD version and status transitions
- US 56891 — Review requirement entries in formal approval workflow
- US 56899 — Finalize BRD approval outcomes
- US 56907 — Enforce architecture readiness gate before build finalization
- US 56916 — Block unsupported external integration assumptions
- US 56924 — Review BRD entries in standardized format
- US 56932 — Link each BRD requirement to source requirement identifier
- US 56940 — View change history for BRD requirement records
- US 56948 — Make build readiness depend on BRD and architecture approval status
- US 56956 — Enforce secure access and audit reporting for BRD and architecture baseline repository
- US 56965 — Track architecture baseline review status
- US 56973 — Review runtime prerequisites against enterprise desktop security standards
- US 56981 — Confirm prerequisite readiness before final build approval
- US 56989 — Document packaging and deployment decisions together
- US 56998 — Block build finalization until architecture baseline is approved
- US 57006 — Flag unapproved integration assumptions during baseline review

No Golden Repo references were provided in the source context, so no Golden Repo conventions were applied.