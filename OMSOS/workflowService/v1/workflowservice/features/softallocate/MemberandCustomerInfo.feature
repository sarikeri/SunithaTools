Feature: AbilityToGroupMemberInfo

  Scenario: Map member info from order document
    Given the input order document with valid member info
    When the softAllocationHandler is executed
    Then the member info in xml should not be null