# Feature: What are archived ideas?
Status: NEW
Owner: Astra
Last Updated: 2026-08-28

## Summary
This feature defines the behavior and purpose of archived ideas within the ideas domain.

Archived ideas allow users to keep a project clean without deleting ideas permanently. The source indicates two primary business outcomes:
1. When multiple similar ideas exist, users can use a merge function to keep one idea and archive the others.
2. Users can archive ideas instead of deleting them, with the expectation that archived ideas can always be restored.

The expected outcome is that ideas can transition into an archived state that preserves them for later restoration, rather than removing them permanently.

## Scope
In scope:
- Defining archived ideas as a non-deleted state for ideas.
- Supporting archival of ideas to keep a project clean.
- Supporting restoration of archived ideas.
- Supporting the merge use case in which one idea is kept and other similar ideas are archived.

Out of scope:
- Permanent deletion behavior.
- Detailed merge workflow beyond the source statement that one idea is kept and others are archived.
- Archived idea search, filtering, listing, or reporting behavior.
- Notification, audit history, analytics, or automation behavior.
- Any UI layout, API endpoint, or platform-specific implementation details not stated in the source.

## Application Type & Platform Context
Application type: Unknown.

Source evidence:
- Derived Source Signals state: "Application Type: unknown"
- Application Type Evidence: "Not specified in source."

Open Question:
- Which application surface(s) must support this feature: web, mobile, desktop, API/service, or multiple?

## Actors and Permissions
Explicitly supported actors:
- User: implied by the source statement that similar ideas "have been created" and that users can use the merge function and restore archived ideas.

Explicitly supported permissions:
- Ability to use the merge function to keep one idea and archive others.
- Ability to archive an idea.
- Ability to restore an archived idea.

Access constraints:
- Not specified in source.

Open Questions:
- Which user roles are permitted to archive ideas?
- Which user roles are permitted to restore archived ideas?
- Which user roles are permitted to perform merges?
- Are there any project-level or ownership-based restrictions on archiving, restoring, or merging ideas?

## Feature Development Intent
This is feature-development work to establish or clarify archived idea behavior as a product capability.

Behavior that must be built or changed:
- Ideas must support an archived state distinct from deletion.
- Users must be able to archive ideas to clean up a project without deleting them.
- Archived ideas must be restorable.
- In merge scenarios involving multiple similar ideas, the system must support keeping one idea and archiving the others.

Outcome to be delivered:
- A reliable archived-state capability for ideas that preserves data for future restoration and supports cleanup of duplicate or similar ideas through merge-related archiving.

## UI Design & Interaction Contract
Source-supported UI behavior:
- Users can use a merge function to keep one idea and archive others.
- Archived ideas can be restored.

Source-supported interaction expectations:
- Archiving must not be equivalent to deleting.
- Restoration must be possible for archived ideas.

Not specified in source:
- Screens, page names, modal behavior, buttons, labels, navigation, empty states, confirmation dialogs, validation messages, bulk actions, visibility of archived ideas, and accessibility requirements.

Open Questions:
- Where in the UI can a user archive an idea?
- Where in the UI can a user restore an archived idea?
- How is the merge function exposed in the UI?
- How are archived ideas visually identified?
- Can users view archived ideas in the same list as active ideas or in a separate view?
- Are confirmations required before archiving, restoring, or merging?
- Are there any required accessibility, copy, or interaction standards for this feature?

## API Contract
Source-supported API/business capability:
- The system must support archival of ideas.
- The system must support restoration of archived ideas.
- The system must support merge behavior where one idea is kept and other ideas are archived.

Not specified in source:
- Whether these capabilities are exposed via API.
- Endpoints, methods, request/response schemas, status codes, permissions model, idempotency behavior, or integration contracts.

Open Questions:
- Is an API required for archiving ideas?
- Is an API required for restoring archived ideas?
- Is an API required for the merge operation?
- What are the request and response contracts for archive, restore, and merge operations?
- What error responses are required when archiving, restoring, or merging fails?
- Must archive and restore operations be idempotent?

## Business Logic & Rules
Source-supported business rules:
1. If multiple and similar ideas have been created, the merge function is used to keep only one idea and archive the others.
2. Archiving is a cleanup mechanism for a project.
3. Archiving does not delete an idea.
4. An archived idea can always be restored.

Implied state logic supported by source:
- An idea can exist in at least two states relevant to this feature: active and archived.
- Merge handling results in one retained idea and one or more archived ideas when similar ideas are consolidated.

Not specified in source:
- How similarity between ideas is determined.
- Whether restore returns an idea to its prior state or to a default active state.
- Whether archived ideas can be edited, merged again, or referenced elsewhere.
- Whether there are limits or exceptions to restoration despite the phrase "can always be restored."

Open Questions:
- How are "multiple and similar ideas" identified for merge eligibility?
- Is similarity determined manually by users, automatically by the system, or both?
- Does restoring an idea always return it to an active state?
- Can an archived idea be merged again or be the target idea in a merge?
- Are there any conditions under which restoration is blocked?

## Data Model & Validation
Source-supported entities:
- Idea

Source-supported data/state expectations:
- An idea must support an archived condition/state.
- An idea must remain preserved when archived so that it can be restored later.

Not specified in source:
- Field names or schema representation for archival state.
- Whether archived timestamp, archived by, restored timestamp, restored by, merge linkage, or kept idea reference must be stored.
- Validation rules for archive, restore, or merge actions.
- Data retention or purge behavior for archived ideas.

Open Questions:
- How is archived status represented in the data model?
- Must the data model record which idea was kept and which ideas were archived during a merge?
- Must the system record who archived or restored an idea and when?
- Are there validation constraints that prevent archiving or restoring in certain states?
- Are archived ideas retained indefinitely?

## Functional Requirements
1. The system shall support archiving an idea without deleting it.
2. The system shall preserve archived ideas so they remain available for restoration.
3. The system shall support restoring an archived idea.
4. The system shall support a merge workflow in which, when multiple similar ideas exist, one idea is kept and the others are archived.
5. The system shall ensure that archiving is available as a project-cleanup action distinct from deletion.
6. The system shall ensure that an archived idea remains recoverable after archival.
7. The system shall not treat archiving as permanent removal of the idea.

Requirements pending clarification:
8. The system shall restrict archive, restore, and merge actions according to the applicable permissions model.  
   Open Question dependency: actor roles and access constraints are not defined in source.
9. The system shall expose archive, restore, and merge capabilities through the required application surface(s).  
   Open Question dependency: platform/application type is not defined in source.
10. The system shall validate merge selection rules for similar ideas.  
   Open Question dependency: similarity criteria and merge eligibility rules are not defined in source.

## Non-Functional Requirements
Source-supported non-functional requirements:
- None explicitly stated.

Implementation context supported by source:
- User-selected Architecture Style: monolith

Constraints or standards not fully specified:
- No explicit performance, reliability, security, accessibility, compliance, or observability requirements are provided in the source.

Open Questions:
- Are there required performance expectations for archive, restore, or merge actions?
- Are there required auditability or observability expectations for these state changes?
- Are there security constraints for who can access archived ideas?
- Are there accessibility requirements for any UI that supports this feature?
- Does the monolith architecture impose any specific implementation constraints for this feature?

## Acceptance Scenarios
### Scenario 1: Archive an idea without deleting it
Given an active idea exists  
When the user archives the idea  
Then the idea shall be placed in an archived state  
And the idea shall not be deleted from the system  
And the idea shall remain available for future restoration

### Scenario 2: Restore an archived idea
Given an idea exists in an archived state  
When the user restores the archived idea  
Then the idea shall no longer remain archived  
And the idea shall be available again for normal use

### Scenario 3: Merge similar ideas by keeping one and archiving others
Given multiple similar ideas exist  
When the user performs the merge function  
Then the system shall keep one idea  
And the system shall archive the other similar ideas  
And the archived ideas shall remain restorable

### Scenario 4: Use archive as a cleanup mechanism
Given a project contains ideas the user does not want to delete permanently  
When the user archives one of those ideas  
Then the project shall be cleaned up without deleting the idea  
And the archived idea shall remain recoverable through restore

## Traceability Matrix
| Source ID | Requirement | Acceptance Criteria | Test Coverage |
|---|---|---|---|
| AABC-1 | FR-1: The system shall support archiving an idea without deleting it. | Archiving ideas is a way to keep your project clean without deleting idea. | Verify an archived idea remains in the system and is not deleted. |
| AABC-1 | FR-2: The system shall preserve archived ideas so they remain available for restoration. | An archived idea can always be restored. | Verify archived ideas remain restorable after archival. |
| AABC-1 | FR-3: The system shall support restoring an archived idea. | An archived idea can always be restored. | Verify a user can restore an archived idea. |
| AABC-1 | FR-4: The system shall support a merge workflow in which one idea is kept and others are archived. | If multiple and similar ideas have been created, use the merge function to keep only one and archive others. | Verify merge keeps one idea and archives the others. |
| AABC-1 | FR-5: The system shall ensure that archiving is available as a project-cleanup action distinct from deletion. | Archiving ideas is also a way to keep your project clean without deleting idea. | Verify archive supports cleanup without permanent removal. |
| AABC-1 | FR-6: The system shall ensure that an archived idea remains recoverable after archival. | An archived idea can always be restored. | Verify restore remains possible after the archive action. |
| AABC-1 | FR-7: The system shall not treat archiving as permanent removal of the idea. | Without deleting idea; archived idea can always be restored. | Verify archival does not permanently remove the idea. |
| AABC-1 | FR-8: The system shall restrict archive, restore, and merge actions according to the applicable permissions model. | Not specified in source; requires clarification. | Define and test role-based access once permissions are confirmed. |
| AABC-1 | FR-9: The system shall expose archive, restore, and merge capabilities through the required application surface(s). | Not specified in source; requires clarification. | Define and test feature availability on confirmed platform(s). |
| AABC-1 | FR-10: The system shall validate merge selection rules for similar ideas. | Multiple and similar ideas have been created; use the merge function. Similarity rules not specified. | Define and test merge eligibility once similarity criteria are confirmed. |

## Open Questions
1. Which application platform(s) must support this feature?
2. Which user roles are allowed to archive ideas?
3. Which user roles are allowed to restore archived ideas?
4. Which user roles are allowed to perform merge actions?
5. How are "multiple and similar ideas" identified for merge purposes?
6. Is similarity determined by users, by system logic, or both?
7. What UI surfaces expose archive, restore, and merge actions?
8. How are archived ideas displayed or identified to users?
9. Can users browse or filter archived ideas?
10. Are confirmation steps required before archive, restore, or merge?
11. Is an API required for archive, restore, and merge operations?
12. If APIs are required, what are the endpoint, method, request, response, and error contracts?
13. How is archived state represented in the data model?
14. Must the system record merge relationships between the kept idea and archived ideas?
15. Must the system record who archived or restored an idea and when?
16. Are there any conditions under which an archived idea cannot be restored?
17. What state does an idea return to after restore?
18. Are archived ideas retained indefinitely, or is there any retention/purge policy?
19. Are there accessibility or copy standards for the UI supporting this feature?
20. Are there any non-functional requirements for performance, security, reliability, or observability?

## Source References
- Feature ID: 14455
- Feature Reference: AABC-1
- Feature Title: What are archived ideas?
- Feature State: Parking lot
- Feature Description: "If multiple and similar ideas have been created, use the merge function to keep only one and archive others. Archiving ideas is also a way to keep your project clean without deleting idea - as an archived idea can always be restored."
- User Story: US AABC-1: What are archived ideas?
- User Story Description: "If multiple and similar ideas have been created, use the merge function to keep only one and archive others. Archiving ideas is also a way to keep your project clean without deleting idea - as an archived idea can always be restored."
- Derived Source Signal: Application Type: unknown
- Derived Source Signal: Application Type Evidence: Not specified in source.
- Source implementation context: User-selected Architecture Style: monolith