# Golden Repository Implementation Guidelines

Generated for: demotest
Repository: Insurance golden repo
Generated at: 2026-10-30T06:18:52.681Z
File selection mode: selected mapped files

## Warnings

- None

## How To Use

- Read this file before implementation in the IDE.
- Use `golden-repo-sources.md` for exact source excerpts and file-path attribution.
- Use Golden Repo guidance for conventions, patterns, validation expectations, architecture style, testing expectations, and implementation constraints.
Golden Repo grounding rules:
- If a selected Golden Repo reference states a rule, constraint, term, or pattern that applies to this feature, the spec must reflect it and cite that file path in Source References.
- Do not force unrelated Golden Repo concepts into the specification. If a reference does not apply to this feature, leave it out.
- Do not invent implementation details that are absent from the Golden Repo or the requirement. Exact endpoints, hosts, schemas, tables, queue names, and infrastructure components that are not stated must be marked Validate or left as Open Questions.
- Also incorporate applicable UI design guidelines, architecture guidelines, policies, business rules, standards, and validation expectations when they apply to this feature.
- If a relevant Golden Repo rule applies but the feature source lacks a product decision, write the gap under Open Questions instead of inventing behavior.
- If a user story conflicts with a Golden Repo example, follow the user story for what to build and keep only the Golden Repo terminology and rules that still apply.
- Cite the Golden Repo file paths of the references you actually used in Source References.
- Existing code patterns in the target workspace override generic Golden Repo guidance when they conflict on stack mechanics.
- Do not require live Golden Repository access inside the implementation workspace.

## Extracted Guidance

GOLDEN REPO KNOWLEDGE CONTEXT (spec generation)
Repository: Insurance golden repo
The following is a distilled, de-duplicated consolidation of Golden Repository conventions. Use a convention only when it is materially relevant to the requested feature. Do not force unrelated concepts into the specification. Do not invent endpoints, hosts, schemas, tables, or queue names that this consolidation does not state; mark those as Validate.

## Architecture & System Design

### Core Architectural Goals
- [G1] Digitize and standardize insurance journeys.
- [G2] Reduce manual processing and turnaround time.

### Configurability and Coverage
- [G3] Support configurable:
  - Products
  - Jurisdictions
  - Currencies
  - Taxes
  - Channels

### Governance, Control, and Audit
- [G4] Ensure:
  - Traceability
  - Segregation of duties
  - Auditability

### Reliability and Continuity
- [G5] Support availability and resilience.
- [G6] Support disaster recovery and business continuity.

### Operations and Supportability
- [G7] Provide observability and operational support.

## Security & Compliance

### Privacy and Data Protection
- [G8] Enforce privacy and data minimization.
- [G9] Encrypt data in transit and at rest.

### Authentication, Authorization, and Identity Controls
- [G10] Require strong authentication and authorization.
- [G11] Support identity verification and KYC.
- [G12] Support fraud screening.

### Auditability, Traceability, and Control
- [G13] Maintain audit logging.
- [G14] Ensure traceability, segregation of duties, and auditability.
- [G15] Support audit and retention.

### Regulatory Compliance
- [G16] Support regulatory reporting.

## UI/UX & Accessibility

### Core UX Outcomes

- [G17] Improve the experience for customers, agents, brokers, and operations users.

### Accessibility

- [G18] Provide accessibility support.

### Localization & Timezone Support

- [G19] Provide localization support.
- [G20] Provide timezone support.

## Domain & Business Rules

### Supported Roles and Actors

- [G21] Support these roles and actors:
  - Customer / policyholder
  - Insured person
  - Proposer / applicant
  - Beneficiary / nominee
  - Agent / advisor
  - Broker
  - Underwriter
  - Claims assessor
  - Claims investigator
  - Finance user
  - Customer service representative
  - Compliance officer
  - Administrator
  - Auditor

### Sales and Onboarding Processes

- [G22] Support customer registration.
- [G23] Support identity verification and KYC.
- [G24] Support quote generation.
- [G25] Support product comparison.
- [G26] Support proposal submission.
- [G27] Support document upload.
- [G28] Support payment collection.
- [G29] Support policy issuance.

### Policy Administration Processes

- [G30] Support policy administration processes including:
  - View policy
  - Download policy documents
  - Change contact details
  - Change nominee / beneficiary
  - Add or remove coverage
  - Endorsement
  - Cancellation
  - Renewal
  - Reinstatement
  - Premium payment and receipts

### Claims Processes

- [G31] Support claims processes including:
  - FNOL
  - Claim validation
  - Coverage verification
  - Document collection
  - Surveyor / assessor assignment
  - Fraud screening
  - Reserve creation
  - Approval and repudiation
  - Settlement
  - Recovery and subrogation
  - Claim closure and reopening

### Governance Processes

- [G32] Support governance processes including:
  - Product approval
  - Rule versioning
  - Approval workflows
  - Delegation of authority
  - Complaint and grievance handling
  - Regulatory reporting
  - Audit and retention

## Error Handling & Resilience

### Availability & Resilience
- [G33] Support availability and resilience.

### Disaster Recovery & Business Continuity
- [G34] Support disaster recovery and business continuity.

## Performance & Observability

### Performance

- [G35] Reduce turnaround time.

### Observability & Operational Support

- [G36] Provide observability and operational support.