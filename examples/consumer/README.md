# spartan-e2e-example-consumer
This project demonstrate how to install the `@spartan/e2e-playwright` library
- First of all, let create a new project following the structure of the boilerplate repositoty
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

## Installation
### Install locally
- Clone the boilerate repo
    ```sh
    git clone git@github.com:c0x12c/spartan-e2e-web-boilerplate.git
    ```
- Build the package
    ```sh
        cd spartan-e2e-web-boilerplate
        yarn build
    ```
- Packaging the library
    ```sh
    yarn package
    ```
- It will create a `package.tgz` file

Let move on to the consumer project
- Install dependencies
    ```sh
    yarn install
    ```
- Install the e2e-playwright package
    ```sh
    yarn add ../../package.tgz
    ```

### Install from registry (TBU)
    ```sh
    yarn add  @spartan/e2e-playwright@1.0.0
    ```
## Modify code project
- In the file `src/features/common.step.ts`, export `common steps` from the e2e library:
    ```typescript
    export * as commonSteps from '@spartan/e2e-playwright/step'
    ```
- In the file `src/pages/base.page.ts`, export new class extending from `BasePage` class from the e2e library:
    ```typescript
    import { BasePage as Page } from "@spartan/e2e-playwright";

    export class BasePage extends Page {}
    ```

## Run
- To run the demonstration
    ```sh
    yarn e2e:ui
    ```



