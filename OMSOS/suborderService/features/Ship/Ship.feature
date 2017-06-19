
Feature: Ship Suborder
  To test Ship API 
  As a developer
  I want to Ship Suborder which belongs ShipReqSent Status

  Scenario Outline: Ship case - One LineItem Successful Ship Scenario
    Given a order <orderId> and suborder <suborderId> with single Li in status <status> is created
    When the order <orderId> and suborder <suborderId> is Shipped response status return should be success
    Then expected Status for suborder <suborderId> should be <ExpectedStatus>
    And suborder <suborderId> shipping info is updated in DB
     And suborder <suborderId> Package info is updated in DB
     And remove shipped suborder <suborderId> from DB 
    Examples:
      | orderId        | suborderId     | status          | ExpectedStatus | 
      | 05200000000100 | 05200000000101 | ShipReqSent     | Shipped        |

  Scenario Outline: Ship Validation case - One LineItem Successful Ship Scenario validation of TrackingNumber missing
  Given a order <orderId> and suborder <suborderId> with single Li in status <status> is created
  When suborder <suborderId> is Shipped, throw validation error if TrackingNumber <TrackingNumber> is missing
    And expected Status for suborder <suborderId> should be <ExpectedStatus>
    And remove shipped suborder <suborderId> from DB 
    Examples:
      | orderId        | suborderId     | status          | ExpectedStatus |  TrackingNumber | 
      | 05200000000300 | 05200000000301 | ShipReqSent     | ShipReqSent    |                 |    

  Scenario Outline: Ship Validation case - One LineItem Successful Ship Scenario validation of QtyShipped vs qtySoftallocated
  Given a order <orderId> and suborder <suborderId> with single Li qtySoftallocated <qtySoftallocated> and in status <status> is created
  When suborder <suborderId> is Shipped, validate QtyShipped <QtyShipped>, throw validation error if not match with qtySoftallocated
    And expected Status for suborder <suborderId> should be <ExpectedStatus>
    And remove shipped suborder <suborderId> from DB 
    Examples:
      | orderId        | suborderId     | status          | ExpectedStatus |  qtySoftallocated | QtyShipped |
      | 05200000000200 | 05200000000201 | ShipReqSent     | ShipReqSent    |  5                | 10         |
      | 05200000000200 | 05200000000201 | ShipReqSent     | ShipReqSent    |  5                | 2          |


  Scenario Outline: Backorder case - One LineItem backordered Scenario
  Given a order <orderId> and suborder <suborderId> with single Li in status <status> is created
  When the order <orderId> and suborder <suborderId> is backordered response status return should be success
  Then expected Status for suborder <suborderId> should be <ExpectedStatus>
    And expected Status for suborder <backorderedId> should be <ExpectedBOStatus>  
    And remove shipped suborder <suborderId> from DB 
    And remove shipped suborder <backorderedId> from DB 
    Examples:
      | orderId        | suborderId     | backorderedId   | status          | ExpectedStatus | ExpectedBOStatus |
      | 05200000000400 | 05200000000401 | 052000000004011 | ShipReqSent     | Deleted        | Backordered      |

  Scenario Outline: Backorder Validation case - One LineItem Successful Ship Scenario  validation of QtyNotShipped vs qtySoftallocated
  Given a order <orderId> and suborder <suborderId> with single Li qtySoftallocated <qtySoftallocated> and in status <status> is created
  When suborder <suborderId> is Shipped, validate QtyNotShipped <QtyNotShipped>, throw validation error if not match with qtySoftallocated
    And expected Status for suborder <suborderId> should be <ExpectedStatus>
    And remove shipped suborder <suborderId> from DB 
    Examples:
      | orderId        | suborderId     | status          | ExpectedStatus |  qtySoftallocated | QtyNotShipped |
      | 05200000000500 | 05200000000501 | ShipReqSent     | ShipReqSent    |  5                | 10            |
      | 05200000000500 | 05200000000502 | ShipReqSent     | ShipReqSent    |  5                | 2             |