Feature: Create bug record test plan edge case governance and traceability
  As a QA Lead
  I want to define and validate edge case coverage for the create bug record test plan
  So that POST /api/v1/bugs validation remains complete, traceable, and approval-ready before release

  Background:
    Given user is on "Test Management Repository" page
    And "create bug record test plan draft" should be visible
    And "repository approval workflow" should be visible

  @edge @regression @priority-high
  Scenario: Approval is blocked when one planned coverage item is left without required requirement mapping
    Given "QA Lead" should be visible
    And "edit permission for create bug record test plan" should be visible
    And "requirement reference c8f316b6-c0b1-474d-a953-38e5677ed6b8" should be visible
    And "requirement reference FR-1" should be visible
    When user clicks on "create bug record test plan draft"
    And user clicks on "Traceability Matrix"
    Then "traceability matrix for POST /api/v1/bugs" should be visible
    And "successful creation" should be visible
    And "payload validation failure" should be visible
    And "unauthenticated access" should be visible
    And "forbidden access for insufficient roles" should be visible
    And "audit verification" should be visible
    And "response-time checks" should be visible
    When user removes "c8f316b6-c0b1-474d-a953-38e5677ed6b8" from "response-time checks" mapping
    And user removes "FR-1" from "response-time checks" mapping
    And user clicks "Save" button
    Then "response-time checks unmapped warning" should be visible
    When user clicks "Validate" button
    Then error message "Every planned coverage item must map to c8f316b6-c0b1-474d-a953-38e5677ed6b8 and FR-1" should be displayed
    And error message "Unmapped scenarios are not permitted" should be displayed
    When user adds "c8f316b6-c0b1-474d-a953-38e5677ed6b8" to "response-time checks" mapping
    And user adds "FR-1" to "response-time checks" mapping
    And user clicks "Save" button
    Then "response-time checks unmapped warning" should be hidden
    And "response-time checks mapped to c8f316b6-c0b1-474d-a953-38e5677ed6b8 and FR-1" should be visible
    When user clicks "Validate" button
    Then "traceability validation passed" should be visible
    And "unmapped coverage error" should be hidden
    And "complete traceability matrix" should be visible

  @edge @regression @priority-high
  Scenario: Validation enforces completeness when one mandatory entry or exit governance rule is missing
    Given "QA Lead" should be visible
    And "edit access to create bug record test plan" should be visible
    And "prerequisites section" should be visible
    And "entry criteria section" should be visible
    And "exit criteria section" should be visible
    And "pass threshold section" should be visible
    And "evidence expectations section" should be visible
    And "unresolved defect handling section" should be visible
    And "deployed build prerequisite" should be visible
    And "reachable POST /api/v1/bugs endpoint prerequisite" should be visible
    And "authentication setup prerequisite" should be visible
    And "seeded roles prerequisite" should be visible
    And "sample payloads prerequisite" should be visible
    And "persistence visibility prerequisite" should be visible
    And "audit log access prerequisite" should be visible
    And "evidence storage location prerequisite" should be visible
    When user clicks on "Entry Criteria"
    And user enters "environment readiness, available API contract, confirmed authentication access, confirmed logging dependency access" in "Entry Criteria" field
    And user removes "evidence storage location" from "Entry Criteria" field
    And user clicks "Save" button
    Then "entry criteria missing evidence storage location" should be visible
    When user clicks "Validate" button
    Then error message "Execution cannot start without all required entry criteria" should be displayed
    And error message "Evidence storage location is required" should be displayed
    When user enters "evidence storage location" in "Entry Criteria" field
    And user clicks on "Exit Criteria"
    And user removes "unresolved high-severity defects block completion" from "Exit Criteria" field
    And user clicks "Save" button
    Then "exit criteria missing high-severity defect blocking rule" should be visible
    When user clicks "Validate" button
    Then error message "Exit criteria are incomplete" should be displayed
    And error message "Unresolved high-severity defects must block completion of create bug record validation" should be displayed
    When user enters "unresolved high-severity defects block completion" in "Exit Criteria" field
    And user enters "measurable pass threshold" in "Pass Threshold" field
    And user enters "mandatory evidence capture for every in-scope coverage item" in "Evidence Expectations" field
    And user clicks "Save" button
    Then "complete entry criteria" should be visible
    And "complete exit criteria" should be visible
    And "measurable pass threshold" should be visible
    And "mandatory evidence capture for every in-scope coverage item" should be visible
    And "high-severity defect blocking rule" should be visible
    When user clicks "Validate" button
    Then "entry and exit criteria completeness passed" should be visible
    And "approval-ready governance rules" should be visible