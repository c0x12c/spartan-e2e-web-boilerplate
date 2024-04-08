import 'dotenv/config'

import { BrowserContext, chromium } from '@playwright/test'
import { initialSetup } from '@synthetixio/synpress/commands/metamask'
import { setExpectInstance } from '@synthetixio/synpress/commands/playwright'
import { prepareMetamask } from '@synthetixio/synpress/helpers'
import { createBdd, test as base } from 'playwright-bdd'

import { BasePage, LoginPage } from '../pages'
import {
  DEFAULT_PASSWORD,
  DEFAULT_PK,
  FEATURES_NEED_METAMASK,
  ONLY_PROJECTS,
  PK_ACCOUNTS,
  SKIP_PROJECTS,
} from './constant'
import { CommonDataProvider, SecretsDataProvider } from './types/data'
import { importAccounts } from './utils'

export type DataFixtures = {
  secretDataProvider: SecretsDataProvider // shared data between steps
  commonDataProvider: CommonDataProvider
}

export type HooksFixtures = {
  // skip test by projects specified in SKIP_PROJECTS or ONLY_PROJECTS environment variables
  skipTestByProject: void
}

export type PageObjectFixtures = {
  basePage: BasePage
  loginPage: LoginPage
}

export type BrowserContextFixtures = {
  context: BrowserContext
}

export const test = base.extend<BrowserContextFixtures & DataFixtures & HooksFixtures & PageObjectFixtures>({
  secretDataProvider: [
    async ({}, use) => {
      await use(new SecretsDataProvider())
    },
    { scope: 'test', auto: false },
  ],
  commonDataProvider: [
    async ({}, use) => {
      await use(new CommonDataProvider())
    },
    { scope: 'test', auto: false },
  ],

  skipTestByProject: [
    async ({}, use, testInfo) => {
      // filter by SKIP_PROJECTS
      testInfo.skip(SKIP_PROJECTS.includes(testInfo.project.name), `Project ${testInfo.project.name} is skipped`)
      // filter by ONLY_PROJECTS only if SKIP_PROJECTS is empty
      if (SKIP_PROJECTS.length == 0 && ONLY_PROJECTS.length > 0) {
        testInfo.skip(
          !ONLY_PROJECTS.includes(testInfo.project.name),
          `Only projects ${ONLY_PROJECTS} are allowed to run`,
        )
      }
      await use()
    },
    { scope: 'test', auto: true },
  ],

  context: async ({}, use, testInfo) => {
    // required for synpress as it shares same expect instance as playwright
    await setExpectInstance(expect)

    // download metamask
    const metamaskPath = await prepareMetamask(process.env.METAMASK_VERSION || '10.25.0')

    const isMetamaskRequired = FEATURES_NEED_METAMASK.some((feature) => testInfo.title.includes(feature))

    // prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      '--remote-debugging-port=9222',
    ]

    if (process.env.CI) {
      browserArgs.push('--disable-gpu')
    }

    if (Boolean(process.env.HEADLESS_MODE)) {
      browserArgs.push('--headless=new')
    }

    // launch browser
    const context = await chromium.launchPersistentContext('', {
      headless: Boolean(process.env.HEADLESS_MODE) ?? false,
      ...(isMetamaskRequired && { args: browserArgs }),
    })

    if (isMetamaskRequired) {
      // wait for metamask
      await context.pages()[0].waitForTimeout(3000)

      // setup metamask
      await initialSetup(chromium, {
        secretWordsOrPrivateKey: DEFAULT_PK,
        network: {
          networkName: 'mumbai',
          rpcUrl: 'https://rpc.ankr.com/polygon_mumbai',
          chainId: '80001',
          symbol: 'MATIC',
          blockExplorer: 'https://mumbai.polygonscan.com/',
          isTestnet: true,
        },
        password: DEFAULT_PASSWORD,
        enableAdvancedSettings: true,
      })

      await importAccounts(PK_ACCOUNTS)

      // await switchAccount(2)
    }

    await use(context)

    if (!process.env.SERIAL_MODE) {
      await context.close()
    }
  },

  basePage: ({ page }, use) => use(new BasePage(page, '')),
  loginPage: ({ page }, use) => use(new LoginPage(page)),
})

export const expect = test.expect
export const { Given, When, Then, Before } = createBdd(test)
