import { Page } from '@playwright/test'
import * as metamask from '@synthetixio/synpress/commands/metamask'

import { ENV } from '../common/constant'
import { CONNECT_WALLET, ENV_KEYS } from '../common/enum'
import { LocalStorageItem } from '../common/types/data'

export class BasePage {
  private baseUrl = ENV[ENV_KEYS.BASE_URL]

  constructor(
    protected page: Page,
    private path: string,
  ) {}

  /**
   * Get Playwright page of the current page.
   *
   * This method should be used for page assertion only.
   * @returns {Page} Playwright page
   */
  getPage(): Page {
    return this.page
  }

  public getUrl(): string {
    return new URL(this.path, this.baseUrl).toString()
  }

  /**
   * Open current page.
   */
  async goto() {
    await this.page.goto(this.getUrl())
  }

  async setLocalStorage(localStorageData: Array<LocalStorageItem>) {
    await this.page.evaluate((localStorageData) => {
      for (let i = 0; i < localStorageData.length; i++) {
        const localStorageItem = localStorageData[i]
        localStorage.setItem(localStorageItem.name, localStorageItem.value)
      }
    }, localStorageData)
  }

  /**
   * Get element by locator
   * @param locator Locator of the element
   */
  getByLocator(locator: string) {
    this.page.locator(locator)
  }

  /**
   * Wait for a timeout. Should be used for debugging only.
   * @param timeout timeout in milliseconds
   */
  async waitForTimeout(timeout: number) {
    await this.page.waitForTimeout(timeout)
  }

  /**
   * Click on an element by its role and name.
   * @param role Role of the element
   * @param name Accessible name of the element
   */
  async clickByRole(role: Parameters<Page['getByRole']>[0], name: string, index?: number) {
    const selectedIndex = index ?? 0
    await this.page.getByRole(role, { name, exact: true }).nth(selectedIndex).click()
  }

  /**
   * Click on an element by locator.
   * @param locator Locator of the element
   * @param index position of index-th locator
   */
  async clickByLocator(locator: string, index?: number) {
    const selectedIndex = index ?? 0
    await this.page.locator(locator).nth(selectedIndex).click()
  }

  /**
   * Click element with text
   * @param text text to click
   */
  async clickByText(text: string) {
    await this.page.getByText(text, { exact: true }).first().click()
  }

  /**
   * Click element with label
   * @param label label of the element
   */
  async clickByLabel(label: string) {
    await this.page.getByLabel(label, { exact: true }).click()
  }

  /**
   * Click element with title
   * @param title title of the element
   */
  async clickByTitle(title: string) {
    await this.page.getByTitle(title).click()
  }

  /**
   * Fill a text box by role 'textbox' and its name.
   * @param name name of the element to search by role 'textbox'
   * @param value value to be filled
   */
  async fillByRoleTextbox(name: string, value: string) {
    await this.page.getByRole('textbox', { name }).fill(value)
  }

  /**
   * Fill a text box by exact placeholder.
   */
  async fillByPlaceholder(placeholder: string, value: string) {
    await this.page.getByPlaceholder(placeholder, { exact: true }).fill(value)
  }

  /**
   * Fill a text box by locator
   * @param locator name of the element to search by locator
   * @param value value to be filled
   */
  async fillByLocator(locator: string, value: string) {
    await this.page.locator(locator).fill(value)
  }

  /**
   * Connect wallet
   * @param walletNumber number of wallet you want to connect
   */
  async connectWallet(walletNumber: number) {
    await metamask.switchAccount(walletNumber)
    await this.clickByRole('button', CONNECT_WALLET.KEY_CONNECT)
    await this.clickByRole('button', CONNECT_WALLET.KEY_PROVIDER)
    await metamask.acceptAccess({
      confirmSignatureRequest: true,
    })
  }
}
