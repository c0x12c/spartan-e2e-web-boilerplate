# spartan-e2e-web-test-boilerplate

End-to-end testing framework for web dashboard, using Playwright and Cucumber.

## Getting started

### Prerequisites
- First of all, git clone e2e boilerplate:
```sh
git clone git@github.com:c0x12c/spartan-e2e-web-boilerplate.git
```
- Install dependencies
```sh
yarn install
```
- Install Playwright browser
```sh
npx playwright install
```
- The environment variables starting with `E2E_` in `.env.example` are required for success execution.
  - On local, these environment variables should be placed inside file `.env`, e.g.

```sh
E2E_BASE_URL="https://circuit.dev.nukey.fi"
E2E_SKIP_PROJECTS=
E2E_ONLY_PROJECTS=
E2E_TAGS=
```

<details>

<summary>Environment variables description</summary>

| name                 | description                                                                                                                                                                                                                                       |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| E2E_BASE_URL         | URL to web dashboard                                                                                                                                                                                                                              |
| E2E_SKIP_PROJECTS    | Projects to skip (all available projects are in `playwright.config.ts`).                                                                                                                                                                          |
| E2E_ONLY_PROJECTS    | Projects to be executed (projects that is not included will not be executed). This option is valid only if `E2E_SKIP_PROJECTS` is not set.                                                                                                        |
| E2E_TAGS             | Cucumber tag expression of scenarios to be executed on **CI environment**.                                                                                                                                                                        |

</details>

### Test execution

Common commands are defined in `package.json`

<details>

<summary>Command explaination</summary>

To make use of cucumber BDD nature and Playwright test runner, test cases are defined in feature files (`*.feature`), and before execution these feature files will be translated into Playwright spec files (in folder `<project_root>/.features-gen`), then these spec files will be executed using Playwright runner.

Therefore the run command consists of 2 parts, i.e. generation of spec files and test execution, e.g.

```json
// File package.json
{
  // ...
  "scripts" : {
    // ...
    "e2e" : "yarn bddgen && yarn playwright test",
  }
}
```

</details>

#### Local environment

Please contact authorized team members for file `data/user.local.json`. It stores credentials to login to web dashboard.

Then use below commands for local execution:

- Run all tests

```sh
yarn e2e:local
```

- Run tests filtered by Cucumber tag expression: Specify tag expression **in command**, e.g.

```sh
E2E_TAGS="@Debug" yarn e2e:tag-local
```

- Run tests in UI mode

```sh
E2E_TAGS="@Debug" yarn e2e:ui
```

- Show last execution report

```sh
yarn e2e:report
```

#### CI environment

- Run all tests

```sh
yarn e2e
```

- Run tests filtered by Cucumber tag expression: Modify tag expression in env file, e.g. `E2E_TAGS="@Feature:A or @Feature:B"`, then

```sh
yarn e2e:tag
```

## Project Directory
```sh
src
├── common
│   ├── constant.ts
│   ├── enum.ts
│   ├── fixtures.ts
│   ├── types
│   │   ├── common.ts
│   │   ├── data.ts
│   │   ├── exception.ts
│   │   └── secrets.ts
│   └── utils.ts
├── features
│   ├── <group>
│   │   ├── <group>.data.ts
│   │   ├── <group>.feature
│   │   └── <group>.step.ts
│   ├── common.step.ts
├── pages
│   ├── base.page.ts
│   ├── <group>.page.ts
├── common.json
├── secrets.json
```
## Writing Test

### Scenario definition

- Scenarios are defined in feature file `*.feature` under folder `features/<group>`.
  - `<group>` is the group of features, or it can be the name of page where these scenarios will be applied.

- The common steps should be used if applicable (see `features/common.step.ts`). If there is a new step, it should follow the naming convention:
  - It should be unique.
  - Therefore, it should contain the context of step like the feature description or part of page that will be affected by that step.
    - e.g. `I select random FROM date in UM Filter modal`
      - `UM` is the feature (User management)
      - `Filter modal` is where the action *select FROM date* occurs
- The feature step (the step can be only executed in specified scenario) should be placed in `features/<group>/<group>.step.ts`. For example: [Login Feature](src/features/auth/)
  
## Working with Data

### Data location

- For non-confidential data, it should be placed inside feature file or in `common.json` and it is passed directly to step as paramters. Note that these data should also not be different in different environments, otherwise it should be treated as confidential data.

```gherkin
Scenario Outline: Sample scenario
    Given I go to homepage
    And I click sort by "<criteria>"
    Then Items in homepage should be sorted by "<criteria>"
    Examples:
      | criteria |
      | name     |
      | date     |
```

### External data

- We have 2 types of external data: common and secrets test data.
For common action like click button, input text. We need to define data for each feature in json like:
```json
// File common.json
{
    "address": {
        "name": "E2E4",
        "address": "0x8881bA8f386431661C90D89EEB87C15f0Ea85FbF"
    }
}
```
- For confidential (secrets) data, it should be placed inside an external JSON file `secrets.json`, and then the data is loaded and used in step function of page (see below section).
To get JSON file for runnning locally, please ask authorized members in team.

```json
// File secrets.json
{
  "admin": {
    "email": "admin@gmail.com",
    "password": "password"
  },
  "user": {
    "email": "user@gmail.com",
    "password": "password"
  }
}
```
- To use the data in a scenario, refer to its name in the JSON file depending on whether it's secret or common.

```gherkin
Scenario: Login successfully with correct account
  Given I go to login page
  When I type secret data with key "user.email" to input with locator "input[name='email']"
  And I type secret data with key "user.password" to input with locator "input[name='password']"
  And I click button with locator "form > button"
  Then I should be in home page
```

### Implementation
After defining the scenario, we have to implement functions that are embedded with the content of the step.
#### Step function
- Step: `When I click button with locator "form > button"` will have step function that implemented in `common.step.ts`:
```ts
When('I click button with locator {string} at index {int}', async ({ basePage }, locator, index) => {
  await basePage.clickByLocator(locator, index)
})
```
- Test function should only contain calls to [page objects](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/) and assertion logic.

#### Page object class

- A page object class:
  - Located at `pages/<page_name>.page.ts`
  - Must extends `BasePage`
  - Contains locators and actions that can be performed in that page.
    - Locators should be public so it can be accessed by step for *assertions*.
    - Actions should be defined as public methods in the class. If there is a new common methods for all pages, it should be placed inside `BasePage` instead.
    - If a dynamic locator is needed, a method should be created to returns the locator based on given variables.
- Constants are placed in `common/enum.ts`. All constants related to a page object should belong to a single enum.

```ts
export class UserManagementPage extends BasePage {
  firstSearchEntry: Locator;

  constructor(page: Page) {
    super(page, USER_MANAGEMENT_PAGE.PATH);
    // constant USER_MANAGEMENT_PAGE.PATH is defined in enum file

    // initialize locator in constructor
    this.firstSearchEntry = this.page.locator(
      `table tr:nth-child(1) td:nth-child(1) p`,
    );
    // ...
  }

  // dynamic locator
  async getCellValue(rowIndex: number, columnIndex: number) {
    return this.page.locator(
      `table tr:nth-child(${rowIndex + 1}) td:nth-child(${columnIndex})`,
    ).innerText();
  }

  // an action
  async gotoFirstSearchResult() {
    const searchEntryText = await this.firstSearchEntry.innerText();
    await this.clickByText(searchEntryText);
    // this.clickByText is a common method/action, placed in BasePage
  }
  // ...
```

#### Fixture

- After page object class is defined, there should be a corresponding [fixture](https://playwright.dev/docs/test-fixtures) for it (in `common/fixtures.ts`):

```ts
// ...

export type PageObjectFixtures = {
  basePage: BasePage;
  userManagementPage: UserManagementPage; // define fixture for UserManagementPage
  // ...
};

export const test = base.extend<
  DataFixtures & HooksFixtures & PageObjectFixtures
>({
  // ...

  basePage: ({ page }, use) => use(new BasePage(page, '')),
  // creation logic of fixture userManagementPage
  userManagementPage: ({ page }, use) => use(new UserManagementPage(page)),
  // ...
});

// these Given, When, Then function will be use instead of default ones
export const { Given, When, Then } = createBdd(test);
```

<details>

<summary> Note </summary>

From above example, it can be seen that all page object fixtures use the same instance of Playwright `page` object, therefore a scenario can contains steps of different pages (But previous steps should navigate to the corresponding page in the next step).

</details>

- The page object fixture will then be available in any step function:

```ts
When(
  'I click first UM search result',
  async ({ userManagementPage }) => {
    // use fixture userManagementPage when refer to page UserManagementPage
    await userManagementPage.gotoFirstSearchResult();
  },
);
```

- **Shared data between steps**: There is a dedicated fixture `secretDataProvider` or `commonDataProvider` for storing secret and common data between steps in a scenario.

```ts
When(
  'I type secret data with key {string} to input with role {string}',
  async ({ secretDataProvider, basePage }, dataKey, inputName) => {
    const dataContent = getDataByKey(secretDataProvider.secretsData ?? dataKey, dataKey) ?? dataKey
    await basePage.fillByRoleTextbox(inputName, dataContent)
  },
)
```
A new shared data should be defined as an attribute of class `ScenarioData` (in `common/types/data.ts`)