Feature: Test Go action

    # Go to
    Scenario: Go to
    Given I go to home page
    Then I should be in login page

    # Go back
    Scenario: Go back
    Given I go to login page
    When I type secret data with key "user.email" to input with placeholder "Email Address"
    And I type secret data with key "user.password" to input with placeholder "Password"
    And I click button with locator "form > button"
    And I click element with locator "a[href='/address-book']"
    Then I should be in another page

    # Go forward
    Scenario: Go forward
    Given I go to login page
    When I go back
    And I go forward
    Then I should be in login page