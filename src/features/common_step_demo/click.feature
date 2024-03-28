Feature: Test Click

    Background: Go to login page
    Given I go to login page

    # Click element
    Scenario: Click element with locator
    When I click element with locator "input[type='checkbox']"

    Scenario: Click element with label
    # TBU

    Scenario: Click element with role and name
    # TBU

    # Click button
    Scenario: Click button
    # TBU

    Scenario: Click button at index
    # TBU

    Scenario: Click button with locator
    When I click button with locator "form > button"
    Then I expect that the text "Email is required" is visible
    And I expect that the text "Password is required" is visible

    Scenario: Click button with locator at index
    When I click button with locator "form > button" at index 0
    Then I expect that the text "Email is required" is visible
    And I expect that the text "Password is required" is visible

    # Click menuitem
    Scenario: Click menuitem
    # TBU

    # Click link
    Scenario: Click link
    # TBU