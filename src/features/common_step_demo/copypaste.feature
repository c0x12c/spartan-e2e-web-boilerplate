Feature: Test copy paste

    Background: Login successfully
    Given I go to login page
    When I type secret data with key "user.email" to input with placeholder "Email Address"
    And I type secret data with key "user.password" to input with placeholder "Password"
    And I click button with locator "form > button"

    Scenario: Copy element with label to clipboard and paste it to input with label
    # TBU

    Scenario: Copy element with label to clipboard and paste it to input with role
    # TBU


    Scenario: Copy element with locator to clipboard and paste it to input with placeholder 
    When I copy element with locator "div > h5" to clipboard
    And I paste from clipboard to input with placeholder "Search by Vault name or address" 
    And I wait for 5 seconds

    Scenario: Copy element with locator to clipboard and paste it to input with locator at index
    When I copy element with locator "div > h5" to clipboard
    And I paste from clipboard to input with locator "div > input" at index 1 
    And I wait for 5 seconds

