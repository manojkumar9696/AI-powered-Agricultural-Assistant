Feature: Accessible creation and approval of the create bug record test plan
  As a QA Lead
  I want the create bug record test plan editor to be accessible
  So that I can consistently document, review, save, and submit POST /api/v1/bugs coverage before release

  Background:
    Given user is logged into "Test Management Repository" as "QA Lead"
    And user is on "Create Bug Record Test Plan Editor" page
    And "POST /api/v1/bugs" test plan is available for create or edit
    And "QA Lead" has access to document scope, prerequisites, governance, and traceability
    And no browser extensions that alter focus behavior are enabled

  @accessibility @a11y @functional @priority-high
  Scenario: Keyboard-only navigation supports creating, reviewing, and submitting the create bug record test plan
    When user navigates through "Create Bug Record Test Plan Editor" page using keyboard only
    Then visible keyboard focus should be displayed on the first interactive element
    And keyboard focus should remain clearly discernible
    When user navigates through page header, plan title field, section navigation, and action buttons using keyboard only
    Then focus should move in a logical order
    And no interactive control should be skipped
    And "Edit" should be enabled
    And "Save Draft" should be enabled
    And "Submit for Approval" should be enabled
    When user enters "successful POST /api/v1/bugs requests, request validation failures, authorization rejection, audit verification, and response-time checks" in "In-Scope Coverage" field
    Then "In-Scope Coverage" should retain the entered value
    When user interacts with prerequisites, entry criteria, exit criteria, and traceability matrix sections using keyboard only
    Then all form controls in those sections should be operable by keyboard
    And expanded controls should receive focus appropriately
    But focus should not become trapped in any component
    When user clicks "Save Draft" button
    Then success message "Draft saved successfully" should be displayed
    And keyboard focus should remain on a sensible element
    When user clicks "Submit for Approval" button
    Then submission workflow should be operable by keyboard
    And any confirmation dialog or status update should be operable by keyboard
    When user navigates to the status area using keyboard only
    Then final plan status should be understandable by keyboard navigation
    And all key workflow actions for this feature should be keyboard accessible

  @accessibility @a11y @functional @priority-high
  Scenario Outline: Screen reader labeling and status announcements make plan sections, validation errors, and workflow outcomes understandable
    Given screen reader "<screenReader>" is running
    And the editor contains labeled sections for coverage, prerequisites, entry criteria, exit criteria, evidence expectations, and traceability matrix
    When user navigates through the page by headings, landmarks, and form fields
    Then page title "<pageTitle>" should be visible
    And major plan areas should be exposed as distinct headings or landmarks
    When user navigates to "<fieldName>" field
    Then "<fieldName>" should be visible
    And the field should have an accessible name matching the visible label
    And the field should announce its control type
    And the field should communicate required status where applicable
    When user enters "" in "<invalidField>" field
    And user clicks "Save Draft" button
    Then error message "<error>" should be displayed
    And the validation error should identify the missing information clearly
    And the affected field or section should be associated with the validation error
    When user enters "<correctedValue>" in "<invalidField>" field
    And user clicks "Save Draft" button
    Then success message "Draft saved successfully" should be displayed
    And previous validation error "<error>" should be hidden
    When user clicks "Submit for Approval" button
    Then user should see "<statusMessage>" message
    And the resulting plan state should be understandable to assistive technology
    When user navigates through the traceability matrix by row and column
    Then row and column context should be understandable
    And mapped requirement references "c8f316b6-c0b1-474d-a953-38e5677ed6b8" and "FR-1" should be identifiable without relying on visual position alone

    Examples:
      | screenReader | pageTitle                              | fieldName         | invalidField          | error                                         | correctedValue                                      | statusMessage                           |
      | NVDA         | Create Bug Record Test Plan Editor     | Plan Title        | Evidence Expectations | Evidence storage location is required         | Repository evidence location documented             | Plan submitted for approval             |
      | JAWS         | Create Bug Record Test Plan Editor     | Entry Criteria    | Traceability Matrix   | Requirement mapping is required for coverage  | Successful creation mapped to c8f316b6-c0b1-474d-a953-38e5677ed6b8 and FR-1 | Plan submitted for approval             |
      | NVDA         | Create Bug Record Test Plan Editor     | Exit Criteria     | Evidence Expectations | Evidence storage location is required         | Audit evidence and response evidence documented     | Plan saved and pending approval review  |