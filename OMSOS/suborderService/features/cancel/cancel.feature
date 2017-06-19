Feature: Cancel Suborder
  To test CancelSuborder service
  As a developer
  I want to cancel Suborder which belongs Shipped/BackOrdared/Cancelled/New Status

  Scenario Outline: Cancel Suborders
    Given a order <orderId> having suborder <suborderId> in status <status>
    When the suborder <suborderId> is cancelled using cancel suborder service
    Then suborder <suborderId> status should move to <ExpectedStatus>
        And remove suborder <suborderId>

    Examples:
      | orderId        | suborderId     | status      | ExpectedStatus |
      | 05289743208100 | 05289743208101 | Shipped     | Shipped        |
      | 05289743208100 | 05289743208102 | BackOrdared | Cancelled      |
      | 05289743208100 | 05289743208103 | Cancelled   | Cancelled      |      