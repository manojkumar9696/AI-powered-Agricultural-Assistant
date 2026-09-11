Feature: Prevent approval of incomplete create bug record test plans
  As a QA Lead
  I want the test management repository to reject incomplete create bug record test plans
  So that POST /api/v1/bugs validation is governed consistently before release

  Background:
    Given user is on "Create Bug Record Test Plan" page
    And user has edit access to the test management repository
    And a draft plan exists for "POST /api/v1/bugs"

  @negative @regression @priority-high
  Scenario Outline: Finalization is rejected when mandatory in-scope coverage is missing
    Given "In-Scope Coverage" should be visible
    And the draft plan omits required coverage item "<missingCoverageItem>"
    When user clicks "Save" button
    And user clicks "Submit for Approval" button
    Then error message "<validationMessage>" should be displayed
    And "<missingCoverageItem>" should be visible
    And "Draft" should be visible
    But "Approved" should be visible
    And "No approved version created" should be visible

    Examples:
      | missingCoverageItem         | validationMessage                                             |
      | audit verification          | Missing required in-scope coverage item: audit verification   |
      | response-time checks        | Missing required in-scope coverage item: response-time checks |
      | forbidden access            | Missing required in-scope coverage item: forbidden access     |
      | payload validation failure  | Missing required in-scope coverage item: payload validation failure |

  @negative @regression @priority-high
  Scenario Outline: Finalization is rejected when governance controls are incomplete
    Given "Prerequisites" should be visible
    And "Entry Criteria" should be visible
    And "Exit Criteria" should be visible
    And the draft plan omits required governance item "<missingGovernanceItem>"
    When user clicks "Save" button
    And user clicks "Mark Ready for Pre-Release Use" button
    Then error message "<validationMessage>" should be displayed
    And "<missingGovernanceItem>" should be visible
    And "Requires Changes" should be visible
    But "Approved" should be visible
    And "No approved reference plan available" should be visible

    Examples:
      | missingGovernanceItem                    | validationMessage                                                           |
      | audit log access prerequisite            | Missing required prerequisite: audit log access                             |
      | evidence storage location                | Missing required evidence detail: evidence storage location                 |
      | pass threshold                           | Missing required exit criterion: pass threshold                             |
      | unresolved high-severity defect rule     | Missing required governance rule: unresolved high-severity defects block completion |

  @negative @regression @priority-high
  Scenario Outline: Finalization is rejected when traceability mappings are incomplete
    Given "Traceability Matrix" should be visible
    And all planned coverage items are listed in the draft plan
    And the traceability matrix has mapping status "<mappingStatus>" for coverage item "<coverageItem>"
    When user clicks "Save" button
    And user clicks "Submit for Approval" button
    Then error message "<validationMessage>" should be displayed
    And "<coverageItem>" should be visible
    And "<missingRequirement>" should be visible
    And "Rejected" should be visible
    But "Approved" should be visible
    And "All planned coverage items must be fully mapped" should be visible

    Examples:
      | mappingStatus      | coverageItem             | missingRequirement                        | validationMessage                                                           |
      | unmapped           | audit verification       | c8f316b6-c0b1-474d-a953-38e5677ed6b8      | Traceability gap detected for audit verification                            |
      | partially mapped   | forbidden access         | FR-1                                      | Incomplete traceability detected for forbidden access                       |
      | unmapped           | response-time checks     | FR-1                                      | Traceability gap detected for response-time checks                          |
      | partially mapped   | payload validation failure | c8f316b6-c0b1-474d-a953-38e5677ed6b8    | Incomplete traceability detected for payload validation failure             |