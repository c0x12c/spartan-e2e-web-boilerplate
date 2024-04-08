import { Page } from '@playwright/test'

import { LOGIN_PAGE } from '../common/enum'
import { BasePage } from './base.page'

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page, LOGIN_PAGE.PATH)
  }

  async login(username: string, password: string) {
    await this.goto()
    await this.fillByRoleTextbox(LOGIN_PAGE.INPUT_USERNAME, username)
    await this.fillByRoleTextbox(LOGIN_PAGE.INPUT_PASSWORD, password)
    await this.clickByLocator('form > button')
  }
}
