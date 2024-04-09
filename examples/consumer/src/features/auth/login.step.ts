import { expect, Given } from '../../common/fixtures'
import { LoginInfo } from '../../common/types/secrets'
import { BasePage, LoginPage } from '../../pages'
import testData from './login.data'

Given('I login as user', async ({ secretDataProvider, basePage, loginPage }) => {
  await loginStep(basePage, loginPage, testData.user)
})

Given('I login as admin', async ({ secretDataProvider, basePage, loginPage }) => {
  await loginStep(basePage, loginPage, testData.admin)
})

const loginStep = async (basePage: BasePage, loginPage: LoginPage, loginInfo: LoginInfo) => {
  await loginPage.goto()
  // login will navigate to home page
  await expect(loginPage.getPage()).toHaveURL(new RegExp(basePage.getUrl()))
}
