Feature: Test hover

    Background: Login successfully
    Given I go to login page
    When I type secret data with key "user.email" to input with placeholder "Email Address"
    When I type secret data with key "user.password" to input with placeholder "Password"
    When I click button with locator "form > button"

    Scenario: Hover on element with locator
    When I hover on element with locator "button[title='WalletConnect']"
    And I wait for 3 seconds

    Scenario: Hover on element with label
    #TBU

    Scenario: Hover on element with role and name
    #TBU