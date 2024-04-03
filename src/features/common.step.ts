import { defineParameterType } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import { Given, Then, When } from '../common/fixtures'
import { getDataByKey } from '../common/utils'

defineParameterType({
  name: 'listOfString',
  regexp: /\[([^\]]*)\]/,
  transformer: (str: string) => str.split(',').map((item) => item.trim()),
})

/**
 * Action: Go
 */
Given('I go to home page', async ({ basePage }) => {
  await basePage.goto()
})

Given('I go to login page', async ({ loginPage }) => {
  await loginPage.goto()
})

When('I go back', async ({ basePage }) => {
  await basePage.goBack()
})

When('I go forward', async ({ basePage }) => {
  await basePage.goForward()
})

/**
 * Action: Close tab
 */
When('I close current tab', async ({ basePage }) => {
  await basePage.close()
})

When('I close tab at index {int}', async ({ basePage }, index) => {
  await basePage.closeByIndex(index)
})

/**
 * Action: Wait
 */
When('I wait for {int} seconds', async ({ basePage }, seconds) => {
  await basePage.waitForTimeout(seconds * 1000)
})

When('I wait for response of API with key {string}', async ({ commonDataProvider, basePage }, dataKey) => {
  const apiUrl = getDataByKey(commonDataProvider.commonData, dataKey)
  await basePage.waitForResponse(apiUrl)
})

/**
 * Action: Type
 */
When(
  'I type data with key {string} to input with role {string}',
  async ({ commonDataProvider, basePage }, dataKey, inputName) => {
    const dataContent = getDataByKey(commonDataProvider.commonData, dataKey)
    await basePage.fillByRoleTextbox(inputName, dataContent)
  },
)

When(
  'I type data with key {string} to input with locator {string}',
  async ({ commonDataProvider, basePage }, dataKey, locator) => {
    const dataContent = getDataByKey(commonDataProvider.commonData, dataKey) ?? dataKey
    await basePage.fillByLocator(locator, dataContent)
  },
)

When(
  'I type data with key {string} to input with placeholder {string}',
  async ({ commonDataProvider, basePage }, dataKey, placeholder) => {
    const dataContent = getDataByKey(commonDataProvider.commonData, dataKey) ?? dataKey
    await basePage.fillByPlaceholder(placeholder, dataContent)
  },
)

When(
  'I type secret data with key {string} to input with role {string}',
  async ({ secretDataProvider, basePage }, dataKey, inputName) => {
    const dataContent = getDataByKey(secretDataProvider.secretsData ?? dataKey, dataKey) ?? dataKey
    console.log(dataContent)
    await basePage.fillByRoleTextbox(inputName, dataContent)
  },
)

When(
  'I type secret data with key {string} to input with locator {string}',
  async ({ secretDataProvider, basePage }, dataKey, locator) => {
    const dataContent = getDataByKey(secretDataProvider.secretsData ?? dataKey, dataKey) ?? dataKey
    console.log(dataContent)
    await basePage.fillByLocator(locator, dataContent)
  },
)

When(
  'I type secret data with key {string} to input with placeholder {string}',
  async ({ secretDataProvider, basePage }, dataKey, placeholder) => {
    const dataContent = getDataByKey(secretDataProvider.secretsData ?? dataKey, dataKey) ?? dataKey
    await basePage.fillByPlaceholder(placeholder, dataContent)
  },
)

When('I type {string} to input with locator {string}', async ({ basePage }, dataContent, locator) => {
  await basePage.fillByLocator(locator, dataContent)
})

When('I type {string} to input with role {string}', async ({ basePage }, text, inputName) => {
  await basePage.fillByRoleTextbox(inputName, text)
})

When('I type {string} to input with placeholder {string}', async ({ basePage }, text, placeholder) => {
  await basePage.fillByPlaceholder(placeholder, text)
})

When('I type {string} to input with role {string} at index {int}', async ({ basePage }, text, name, index) => {
  await basePage.getPage().getByRole('textbox', { name }).nth(index).fill(text)
})

When('I type {string} to input with locator {string} at index {int}', async ({ basePage }, text, locator, index) => {
  await basePage.getPage().locator(locator).nth(index).fill(text)
})

When(
  'I type {string} to input with placeholder {string} at index {int}',
  async ({ basePage }, text, placeholder, index) => {
    await basePage.getPage().getByPlaceholder(placeholder, { exact: true }).nth(index).fill(text)
  },
)

/**
 * Action: Fill all
 */
When(
  'I fill all the inputs with placeholder {string} with values: {listOfString}',
  async ({ basePage }, placeholder, values) => {
    for (let index = 0; index < values.length; index++) {
      const value = values[index]
      await basePage.getPage().getByPlaceholder(placeholder, { exact: true }).nth(index).fill(value)
    }
  },
)

/**
 * Action: Hover
 */
When('I hover on element with label {string}', async ({ basePage }, label) => {
  await basePage.hoverByLabel(label)
})

When('I hover on element with locator {string}', async ({ basePage }, locator) => {
  await basePage.hoverByLocator(locator)
})

When('I hover on element with role {string} and name {string}', async ({ basePage }, role, name) => {
  await basePage.hoverByRole(role, name)
})

/**
 * Action: Click
 */
When('I click element with locator {string}', async ({ basePage }, locator) => {
  await basePage.clickByLocator(locator)
})

When('I click element with label {string}', async ({ basePage }, label) => {
  await basePage.clickByLabel(label)
})

When('I click element with role {string} and name {string}', async ({ basePage }, role, name) => {
  await basePage.clickByRole(role, name)
})

When('I click element with text {string}', async ({ basePage }, text) => {
  await basePage.clickByText(text)
})

When('I click link {string}', async ({ basePage }, name) => {
  await basePage.clickByRole('link', name)
})

When('I click button {string}', async ({ basePage }, name) => {
  await basePage.clickByRole('button', name)
})

When('I click button {string} at index {int}', async ({ basePage }, name, index) => {
  await basePage.clickByRole('button', name, index)
})

When('I click button with locator {string}', async ({ basePage }, locator) => {
  await basePage.clickByLocator(locator)
})

When('I click button with locator {string} at index {int}', async ({ basePage }, locator, index) => {
  await basePage.clickByLocator(locator, index)
})

When('I click menuitem {string}', async ({ basePage }, name) => {
  await basePage.clickByRole('menuitem', name)
})

/**
 * Action: Copy
 */
When('I copy element with label {string} to clipboard', async ({ basePage }, label) => {
  await basePage.copyByLabel(label)
})

When('I copy element with locator {string} to clipboard', async ({ basePage }, locator) => {
  await basePage.copyByLocator(locator)
})

/**
 * Action: Paste
 */
When('I paste from clipboard to input with label {string}', async ({ basePage }, label) => {
  await basePage.pasteByLabel(label)
})

When('I paste from clipboard to input with role {string}', async ({ basePage }, name) => {
  await basePage.pasteByRoleTextbox(name)
})

When('I paste from clipboard to input with placeholder {string}', async ({ basePage }, placeholder) => {
  await basePage.pasteByPlaceholder(placeholder)
})

When('I paste from clipboard to input with locator {string}', async ({ basePage }, locator) => {
  await basePage.pasteByLocator(locator, 0)
})

When('I paste from clipboard to input with locator {string} at index {int}', async ({ basePage }, locator, index) => {
  await basePage.pasteByLocator(locator, index)
})

/**
 * Assertion
 */
Then('I should be in home page', async ({ basePage }) => {
  await expect(basePage.getPage()).toHaveURL(basePage.getUrl())
})

Then('I should be in login page', async ({ loginPage }) => {
  await expect(loginPage.getPage()).toHaveURL(loginPage.getUrl())
})

Then('I should be in another page', async ({ basePage }) => {
  await expect(basePage.getPage()).not.toHaveURL(basePage.getUrl())
})

Then('I expect that the title contains {string}', async ({ basePage }, keyword) => {
  await expect(basePage.getPage()).toHaveTitle(new RegExp(keyword))
})

Then('I expect that the text {string} is visible', async ({ basePage }, text) => {
  await expect(basePage.getPage().getByText(text, { exact: true }).first()).toBeVisible()
})

Then('I expect that the text {string} is invisible', async ({ basePage }, text) => {
  await expect(basePage.getPage().getByText(text, { exact: true }).first()).toBeHidden()
})

Then(
  'I expect that the text of data with key {string} is visible',
  async ({ commonDataProvider, basePage }, dataKey) => {
    const dataContent = getDataByKey(commonDataProvider.commonData, dataKey) ?? dataKey
    await expect(basePage.getPage().getByText(dataContent, { exact: true }).first()).toBeVisible()
  },
)

Then(
  'I expect that the text of data with key {string} is invisible',
  async ({ commonDataProvider, basePage }, dataKey) => {
    const dataContent = getDataByKey(commonDataProvider.commonData, dataKey) ?? dataKey
    await expect(basePage.getPage().getByText(dataContent, { exact: true }).first()).toBeHidden()
  },
)

Then('I expect that element with locator {string} is invisible', async ({ basePage }, locator) => {
  await expect(basePage.getPage().locator(locator).first()).toBeHidden()
})

Then('I expect that element with locator {string} is visible', async ({ basePage }, locator) => {
  await expect(basePage.getPage().locator(locator).first()).toBeVisible()
})

Then('I expect that button with text {string} is visible', async ({ basePage }, text) => {
  await expect(basePage.getPage().getByRole('button', { name: text, exact: true }).first()).toBeVisible()
})

Then('I expect that the element with text {string} is invisible', async ({ basePage }, text) => {
  // order is 0-based
  await expect(basePage.getPage().getByText(text, { exact: true })).toBeHidden()
})

Then('I expect that the element with role {string} and order {int} is visible', async ({ basePage }, text, order) => {
  // order is 0-based
  await expect(basePage.getPage().getByRole(text, { exact: true }).nth(order)).toBeVisible()
})

Then(
  'I expect that row number {int} in table contains these values: {listOfString}',
  async ({ basePage }, index, values) => {
    await basePage.getPage().waitForSelector('table') // wait to load data table
    // 1-based index
    const firstRow = await basePage.getPage().locator('table tr').nth(index)
    for (const value of values) {
      await expect(firstRow).toContainText(value)
    }
  },
)

Then('I expect that the table contains {int} record', async ({ basePage }, total) => {
  await basePage.getPage().waitForSelector('table') // wait for the data table to load
  const size = await basePage.getPage().locator('table tr').count()
  expect(size).toBe(total + 1)
})
