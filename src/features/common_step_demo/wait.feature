Feature: Test wait

    # Wait for 
    Scenario: Wait for num seconds
    Given I go to login page
    When I type secret data with key "user.email" to input with placeholder "Email Address"
    And I type secret data with key "user.password" to input with placeholder "Password"
    And I click button with locator "form > button"
    And I wait for 3 seconds
    Then I should be in home page