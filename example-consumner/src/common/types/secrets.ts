/**
 * Secrets data for all scenarios.
 */

export interface SecretsData {
  admin: LoginInfo
  user: LoginInfo
}

export interface LoginInfo {
  email: string
  password: string
}
