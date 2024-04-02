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

  /**
   * Go back to previous page
   */
  async goBack() {
    await this.page.goBack()
  }

  /**
   * Go forward to next page
   */
  async goForward() {
    await this.page.goForward()
  }

  /**
   * Close current tab
   */
  async close() {
    await this.page.close()
  }

  /**
   * Close tab by index
   * @param index index of the tab
   */
  async closeByIndex(index: number) {
    await this.page.context().pages()[index].close()
  }

  /**
   * set localStorage
   * @param localStorageData Array of LocalStorageItem
   */
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
   * Wait for a response. Should be used for debugging only.
   * @param url url of the response
   */
  async waitForResponse(url: string, code = 200) {
    await this.page.waitForResponse((response) => response.url().includes(url) && response.status() === code)
  }

  /**
   * Hover on an element by its label
   * @param label Label of the element
   */
  async hoverByLabel(label: string) {
    await this.page.getByLabel(label).hover()
  }

  /**
   * Hover on an element by its role and name
   * @param role Role of the element
   * @param name Accessible name of the element
   */
  async hoverByRole(role: Parameters<Page['getByRole']>[0], name: string) {
    await this.page.getByRole(role, { name, exact: true }).hover()
  }

  /**
   * Hover on an element by its locator
   * @param locator Locator of the element
   */
  async hoverByLocator(locator: string) {
    await this.page.locator(locator).hover()
  }

  /**
   * Copy text from an element by its label to clipboard
   * @param label Label of the element
   */
  async copyByLabel(label: string) {
    const textContent = await this.page.getByLabel(label).textContent()
    await this.page.evaluate((textContent) => navigator.clipboard.writeText(textContent ?? ''), textContent)
  }

  /**
   * Copy text from an element by its locator to clipboard
   * @param locator Locator of the element
   */
  async copyByLocator(locator: string) {
    const textContent = await this.page.locator(locator).textContent()
    await this.page.evaluate((textContent) => navigator.clipboard.writeText(textContent ?? ''), textContent)
  }

  /**
   * Paste text from clipboard to an input element by its label
   * @param label Label of the element
   */
  async pasteByLabel(label: string) {
    await this.page
      .evaluate(() => navigator.clipboard.readText())
      .then(async (textContent) => {
        await this.page.getByLabel(label).fill(textContent)
      })
  }

  /**
   * Paste text from clipboard to an input element by its role and name
   * @param name Name of the textbox
   */
  async pasteByRoleTextbox(name: string) {
    await this.page
      .evaluate(() => navigator.clipboard.readText())
      .then(async (textContent) => {
        await this.page.getByRole('textbox', { name }).fill(textContent)
      })
  }

  /**
   * Paste text from clipboard to an input element by its placeholder
   * @param placeholder Placeholder of the element
   */
  async pasteByPlaceholder(placeholder: string) {
    await this.page
      .evaluate(() => navigator.clipboard.readText())
      .then(async (textContent) => {
        await this.page.getByPlaceholder(placeholder, { exact: true }).fill(textContent)
      })
  }

  /**
   * Paste text from clipboard to an input element by its locator
   * @param locator Locator of the element
   */
  async pasteByLocator(locator: string, index: number = 0) {
    await this.page
      .evaluate(() => navigator.clipboard.readText())
      .then(async (textContent) => {
        await this.page.locator(locator).nth(index).fill(textContent)
      })
  }

  /**
   * Click on an element by its text
   * @param text Text of the element
   */
  async clickByText(text: string) {
    await this.page.getByText(text, { exact: true }).click()
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
   * Click element with label
   * @param label label of the element
   */
  async clickByLabel(label: string) {
    await this.page.getByLabel(label, { exact: true }).click()
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
