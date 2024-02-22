# spartan-e2e-web-test-boilerplate

End-to-end testing framework for web dashboard, using Playwright and Cucumber.

## Getting started

### Installation

- Install dependencies

```sh
yarn install
```

- Install Playwright browser

```sh
npx playwright install
```

- The environment variables that start with `E2E_` in `.env.example` is required for success execution.
  - On local, these environment variables should be placed inside file `.env`, e.g.

```sh
E2E_BASE_URL="https://circuit.dev.nukey.fi"
E2E_SKIP_PROJECTS=
E2E_ONLY_PROJECTS=
E2E_DATA_USER=
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
| E2E_DATA_<data_name> | Test data file content encoded in base64, with <data_name> specified in `DATA_PATHS` of file `common/enum.ts`. If this variable is not set, the file path in enum value (e.g. `user.local.json`) relative to folder `data/` will be used instead. |

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

## Writing test script

### Scenario definition

- Scenarios are defined in feature file `*.feature` under folder `features/<group>`.
  - `<group>` is the group of features, or it can be the name of page where these scenarios will be applied.

- The common steps should be used if applicable (see `features/common.step.ts`)

- If there is a new step, it should follow the naming convention:
  - It should be unique.
  - Therefore, it should contain the context of step like the feature description or part of page that will be affected by that step.
    - e.g. `I select random FROM date in UM Filter modal`
      - `UM` is the feature (User management)
      - `Filter modal` is where the action *select FROM date* occurs

### Step implementation

#### Step function

- Path to step function: `features/<group>/steps/<feature_name>.step.ts`
  - `<feature_name>` can be same as `<group>` if these steps are common in group of features
- Test function should only contain calls to [page objects](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/) and assertion logic.

```ts
When('I click button {string}', async ({ basePage }, name) => {
  await basePage.clickByRole('button', name);
});

Then('I should be in home page', async ({ basePage }) => {
  await expect(basePage.getPage()).toHaveURL(new RegExp(basePage.getUrl()));
});
```

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

- **Shared data between steps**: There is a dedicated fixture `scenarioData` for storing data between steps *in a scenario (test)*.

```ts
Given('I load data {string}', async ({ scenarioData }, dataName) => {
  // store 
  scenarioData.testData = loadData(dataName);
});

When(
  'I type test data {string} to input {string}',
  async ({ scenarioData, basePage }, dataKey, inputName) => {
    // testData stored with above step can be used in this step
    const dataContent = getTestDataByKey(scenarioData.testData, dataKey);
    // ...
  },
);
```

<details>

<summary> scenarioData definition </summary>

A new shared data should be defined as an attribute of class `ScenarioData` (in `common/types/data.ts`)

</details>

## Working with test data

### Data location

- For non-confidential data, it should be placed inside feature file and it is passed directly to step as paramters. Note that these data should also not be different in different environments, otherwise it should be treated as confidential data.

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

- For confidential data, it should be placed inside an external JSON file in folder `data`, and then the data is loaded and used in step function (see below section).
  - This JSON file should **follows naming convention** `*.local.json` to avoid it accidentially pushed to the repository (it will be ignored by git).
  - To get JSON file for runnning locally, please ask authorized members in team.

```json
// File data/user.local.json
{
    "admin": {
        "username": "<web dashboard username>",
        "password": "<web dashboard password>"
    }
}
```

### External data

- When an external data file is used, it should be defined in `DATA_PATHS` enum (in `common/enum.ts`)

```ts
export enum DATA_PATHS {
  // Test data file paths, relative to data folder
  USER = 'user.local.json',
}
```

- In above example, the **name** of data is `USER`. The framework also assumes that there is an **environment variable** `E2E_DATA_USER` that can be used for replacing `user.local.json` file in CI environment.
  - The value of that environment variable is the *json file content encoded in base64*.

- To use the data in a scenario, refer to its name in common data steps

```gherkin
Scenario: Login
    Given I load data "USER"
    And I go to login page
    When I type test data "admin.username" to input "Email"
    And I type test data "admin.password" to input "Password"
    And I click button "Login"
    Then I should be in home page
```

After step `Given I load data "USER"` the data is available in `scenarioData.testData`

- **Login as a step**: `I login as user {string} from data {string}`. It also re-uses the session within the same execution worker.

- External data structure (type) should be placed in file `common/types/data.ts`

- Complex non-confidential data can also be stored externally like confidential data, except that the name of data file does **not** match `*.local.json`, e.g. `search-criteria.json`, so that it can be committed together with the code to the repository.