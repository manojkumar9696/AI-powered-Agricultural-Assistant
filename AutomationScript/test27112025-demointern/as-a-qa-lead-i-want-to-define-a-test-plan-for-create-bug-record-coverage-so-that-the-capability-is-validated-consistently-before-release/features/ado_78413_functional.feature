Feature: Create bug record test plan governance for pre-release validation
  As a QA Lead
  I want to define and approve a consistent test plan for create bug record coverage
  So that POST /api/v1/bugs is validated with objective scope, governance, and traceability before release

  Background:
    Given user is on "Test Management Repository" page
    And user is authenticated as "QA Lead"
    And user has permission to create and edit test plan documents
    And "POST /api/v1/bugs API contract" should be visible
    And "c8f316b6-c0b1-474d-a953-38e5677ed6b8" should be visible
    And "FR-1" should be visible
    And "Bug Record Creation and Traceability epic details" should be visible

  @functional @regression @priority-high
  Scenario: Create and save a test plan with all required in-scope create bug record coverage items
    When user clicks "New Test Plan" button
    And user enters "POST /api/v1/bugs Create Bug Record Test Plan - Pre-release Validation" in "Test Plan Name" field
    And user clicks "Create" button
    Then "Test Plan Editor" should be visible
    And "Scope" should be visible
    And "Coverage Items" should be visible
    And "Prerequisites" should be visible
    And "Governance" should be visible
    And "Traceability" should be visible
    When user enters "successful create request" in "Coverage Item 1" field
    And user enters "validate successful POST /api/v1/bugs creation behavior" in "Coverage Objective 1" field
    And user enters "payload validation failure" in "Coverage Item 2" field
    And user enters "validate incomplete or malformed request handling for POST /api/v1/bugs" in "Coverage Objective 2" field
    And user enters "unauthenticated access" in "Coverage Item 3" field
    And user enters "validate missing or invalid authentication handling for POST /api/v1/bugs" in "Coverage Objective 3" field
    And user enters "forbidden access for insufficient roles" in "Coverage Item 4" field
    And user enters "validate least-privilege authorization rejection for POST /api/v1/bugs" in "Coverage Objective 4" field
    And user enters "audit verification" in "Coverage Item 5" field
    And user enters "validate audit evidence for create bug record attempts" in "Coverage Objective 5" field
    And user enters "response-time checks" in "Coverage Item 6" field
    And user enters "validate service timing expectations for create bug record processing" in "Coverage Objective 6" field
    And user clicks "Save" button
    Then success message "Test plan draft saved successfully" should be displayed
    When user clicks "Repository List" link
    And user clicks on "POST /api/v1/bugs Create Bug Record Test Plan - Pre-release Validation"
    Then "successful create request" should be visible
    And "payload validation failure" should be visible
    And "unauthenticated access" should be visible
    And "forbidden access for insufficient roles" should be visible
    And "audit verification" should be visible
    And "response-time checks" should be visible
    And "validate successful POST /api/v1/bugs creation behavior" should be visible
    And "validate incomplete or malformed request handling for POST /api/v1/bugs" should be visible
    And "validate missing or invalid authentication handling for POST /api/v1/bugs" should be visible
    And "validate least-privilege authorization rejection for POST /api/v1/bugs" should be visible
    And "validate audit evidence for create bug record attempts" should be visible
    And "validate service timing expectations for create bug record processing" should be visible
    When user clicks "Submit for Approval" button
    Then user should see "Ready for Review" message

  @functional @regression @priority-high
  Scenario: Document execution prerequisites and entry criteria for create bug record validation
    Given user clicks on "POST /api/v1/bugs Create Bug Record Test Plan - Pre-release Validation"
    And "Environment Configuration Records" should be visible
    And "Authentication Setup" should be visible
    And "Seeded Roles" should be visible
    And "Persistence Verification Source" should be visible
    And "Audit Log Access Details" should be visible
    When user clicks "Prerequisites" link
    And user enters "deployed API build is available" in "Prerequisite 1" field
    And user enters "POST /api/v1/bugs endpoint is reachable" in "Prerequisite 2" field
    And user enters "authentication is configured" in "Prerequisite 3" field
    And user enters "seeded QA role is available" in "Prerequisite 4" field
    And user enters "seeded non-privileged role is available" in "Prerequisite 5" field
    And user enters "required sample payload data is available" in "Prerequisite 6" field
    And user enters "persistence visibility is available" in "Prerequisite 7" field
    And user enters "audit log access is available" in "Prerequisite 8" field
    And user clicks "Entry Criteria" link
    And user enters "environment readiness is confirmed" in "Entry Criterion 1" field
    And user enters "POST /api/v1/bugs contract is available" in "Entry Criterion 2" field
    And user enters "authentication dependency access is confirmed" in "Entry Criterion 3" field
    And user enters "logging dependency access is confirmed" in "Entry Criterion 4" field
    And user enters "evidence storage location is identified before execution" in "Entry Criterion 5" field
    And user enters "Release Cycle Evidence Folder" in "Evidence Storage Location" field
    And user clicks "Save" button
    Then success message "Test plan draft saved successfully" should be displayed
    When user clicks "Repository List" link
    And user clicks on "POST /api/v1/bugs Create Bug Record Test Plan - Pre-release Validation"
    And user clicks "Prerequisites" link
    Then "deployed API build is available" should be visible
    And "POST /api/v1/bugs endpoint is reachable" should be visible
    And "authentication is configured" should be visible
    And "seeded QA role is available" should be visible
    And "seeded non-privileged role is available" should be visible
    And "required sample payload data is available" should be visible
    And "persistence visibility is available" should be visible
    And "audit log access is available" should be visible
    When user clicks "Entry Criteria" link
    Then "environment readiness is confirmed" should be visible
    And "POST /api/v1/bugs contract is available" should be visible
    And "authentication dependency access is confirmed" should be visible
    And "logging dependency access is confirmed" should be visible
    And "evidence storage location is identified before execution" should be visible
    And "Release Cycle Evidence Folder" should be visible

  @functional @regression @priority-high
  Scenario: Define measurable exit criteria, evidence requirements, and blocking rules for unresolved high-severity defects
    Given user clicks on "POST /api/v1/bugs Create Bug Record Test Plan - Pre-release Validation"
    And "Governance" should be visible
    When user clicks "Governance" link
    And user enters "all planned coverage items must be executed and pass unless an approved exception is documented" in "Pass Threshold" field
    And user enters "mandatory evidence is required for every in-scope coverage item" in "Evidence Requirement 1" field
    And user enters "API response evidence is required" in "Evidence Requirement 2" field
    And user enters "persistence verification evidence is required" in "Evidence Requirement 3" field
    And user enters "audit verification evidence is required where applicable" in "Evidence Requirement 4" field
    And user enters "unresolved high-severity defects block completion of create bug record validation" in "Defect Blocking Rule" field
    And user clicks "Save" button
    Then success message "Test plan draft saved successfully" should be displayed
    When user clicks "Repository List" link
    And user clicks on "POST /api/v1/bugs Create Bug Record Test Plan - Pre-release Validation"
    And user clicks "Governance" link
    Then "all planned coverage items must be executed and pass unless an approved exception is documented" should be visible
    And "mandatory evidence is required for every in-scope coverage item" should be visible
    And "API response evidence is required" should be visible
    And "persistence verification evidence is required" should be visible
    And "audit verification evidence is required where applicable" should be visible
    And "unresolved high-severity defects block completion of create bug record validation" should be visible

  @functional @regression @priority-high
  Scenario: Complete traceability mapping for every planned create bug record coverage item without gaps
    Given user clicks on "POST /api/v1/bugs Create Bug Record Test Plan - Pre-release Validation"
    And "successful create request" should be visible
    And "payload validation failure" should be visible
    And "unauthenticated access" should be visible
    And "forbidden access for insufficient roles" should be visible
    And "audit verification" should be visible
    And "response-time checks" should be visible
    When user clicks "Traceability" link
    And user enters "successful create request" in "Traceability Row 1 Coverage Item" field
    And user enters "c8f316b6-c0b1-474d-a953-38e5677ed6b8" in "Traceability Row 1 Requirement 1" field
    And user enters "FR-1" in "Traceability Row 1 Requirement 2" field
    And user enters "payload validation failure" in "Traceability Row 2 Coverage Item" field
    And user enters "c8f316b6-c0b1-474d-a953-38e5677ed6b8" in "Traceability Row 2 Requirement 1" field
    And user enters "FR-1" in "Traceability Row 2 Requirement 2" field
    And user enters "unauthenticated access" in "Traceability Row 3 Coverage Item" field
    And user enters "c8f316b6-c0b1-474d-a953-38e5677ed6b8" in "Traceability Row 3 Requirement 1" field
    And user enters "FR-1" in "Traceability Row 3 Requirement 2" field
    And user enters "forbidden access for insufficient roles" in "Traceability Row 4 Coverage Item" field
    And user enters "c8f316b6-c0b1-474d-a953-38e5677ed6b8" in "Traceability Row 4 Requirement 1" field
    And user enters "FR-1" in "Traceability Row 4 Requirement 2" field
    And user enters "audit verification" in "Traceability Row 5 Coverage Item" field
    And user enters "c8f316b6-c0b1-474d-a953-38e5677ed6b8" in "Traceability Row 5 Requirement 1" field
    And user enters "FR-1" in "Traceability Row 5 Requirement 2" field
    And user enters "response-time checks" in "Traceability Row 6 Coverage Item" field
    And user enters "c8f316b6-c0b1-474d-a953-38e5677ed6b8" in "Traceability Row 6 Requirement 1" field
    And user enters "FR-1" in "Traceability Row 6 Requirement 2" field
    And user clicks "Save" button
    Then success message "Test plan draft saved successfully" should be displayed
    And "c8f316b6-c0b1-474d-a953-38e5677ed6b8" should be visible
    And "FR-1" should be visible
    When user clicks "Repository List" link
    And user clicks on "POST /api/v1/bugs Create Bug Record Test Plan - Pre-release Validation"
    And user clicks "Traceability" link
    Then "successful create request" should be visible
    And "payload validation failure" should be visible
    And "unauthenticated access" should be visible
    And "forbidden access for insufficient roles" should be visible
    And "audit verification" should be visible
    And "response-time checks" should be visible
    And "c8f316b6-c0b1-474d-a953-38e5677ed6b8" should be visible
    And "FR-1" should be visible
    And "zero unmapped scenarios" should be visible