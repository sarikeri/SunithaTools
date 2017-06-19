Feature: Get Order
  To test get order API
  As a developer
  I want to get order info

  Scenario Outline: Get Order
    Given the order id <orderId>
    When the get order API is called
    Then given order should be returned

    Examples:
      | orderId        |
      | 05289743208100 |