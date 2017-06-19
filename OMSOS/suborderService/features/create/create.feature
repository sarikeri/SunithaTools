Feature: Create Suborder
  To test create suborder service
  As a developer
  I want to create new Suborder  

  Scenario Outline: Create Suborders
    Given two new suborder object having order id <orderId> and no suborder id
    When the suborders <suborderIds> are created using create suborder service
    Then newly created suborders should get new suborder ids <suborderIds>
        And remove suborders <suborderIds>

    Examples:
      | orderId        | suborderIds                   |
      | 05289743208100 | 05289743208101,05289743208102 |