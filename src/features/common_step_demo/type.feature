Feature: Type step

    Background: "Go to login page"
    Given I go to login page

    # Type to something
    Scenario: Type to something with placeholder
    When I type "hello world" to input with placeholder "Email Address"
    When I type "password" to input with placeholder "Password"
    When I click button with locator "form > button"
    Then I expect that the text "Invalid email" is visible

    Scenario: Type to something with role
    When I type "hello world" to input with role "email"
    When I type "password" to input with role "password"
    When I click button with locator "form > button"
    Then I expect that the text "Invalid email" is visible

    Scenario: Type to something with locator
    When I type "hello world" to input with locator "input[name='email']"
    When I type "password" to input with locator "input[name='password']"
    When I click button with locator "form > button"
    Then I expect that the text "Invalid email" is visible

    # Type data with key to something
    Scenario: Type data with key to something with placeholder
    When I type data with key "address.name" to input with placeholder "Email Address"
    When I type data with key "address.address" to input with placeholder "Password"
    When I click button with locator "form > button"
    Then I expect that the text "Invalid email" is visible

    Scenario: Type data with key to something with role
    When I type data with key "address.name" to input with role "email"
    When I type data with key "address.address" to input with role "password"
    When I click button with locator "form > button"
    Then I expect that the text "Invalid email" is visible

    Scenario: Type data with key to something with locator
    When I type data with key "address.name" to input with locator "input[name='email']"
    When I type data with key "address.address" to input with locator "input[name='password']"
    When I click button with locator "form > button"
    Then I expect that the text "Invalid email" is visible

    # Type secret data with key to something
    Scenario: Type secret data with key to something with placeholder
    When I type secret data with key "user.email" to input with placeholder "Email Address"
    When I type secret data with key "user.password" to input with placeholder "Password"
    When I click button with locator "form > button"
    Then I should be in home page

    Scenario: Type secret data with key to something with role
    When I type secret data with key "admin.email" to input with role "email"
    When I type secret data with key "admin.password" to input with role "password"
    When I click button with locator "form > button"
    Then I should be in home page

    Scenario: Type secret data with key to something with locator
    When I type secret data with key "admin.email" to input with locator "input[name='email']"
    When I type secret data with key "admin.password" to input with locator "input[name='password']"
    When I click button with locator "form > button"
    Then I should be in home page

    # Type to something at index
    Scenario: Type to something with placeholder at index
    When I type "hello@gmail.com" to input with placeholder "Email Address" at index 0
    When I type "password" to input with placeholder "Password" at index 0
    When I click button with locator "form > button"
    Then I expect that the text "The email or password is incorrect!" is visible

    Scenario: Type to something with role at index
    When I type "hello@gmail.com" to input with role "email" at index 0
    When I type "password" to input with role "password" at index 0
    When I click button with locator "form > button"
    Then I expect that the text "The email or password is incorrect!" is visible

    Scenario: Type to something with locator at index
    When I type "hello@gmail.com" to input with locator "input[name='email']" at index 0
    When I type "password" to input with locator "input[name='password']" at index 0
    When I click button with locator "form > button"
    Then I expect that the text "The email or password is incorrect!" is visible