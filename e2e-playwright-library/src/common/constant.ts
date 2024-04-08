import 'dotenv/config'

import { ENV_KEYS } from './enum'

// Environment variables
export const ENV = Object.values(ENV_KEYS).reduce(
  (acc, key) => {
    acc[key] = process.env[key] || ''
    return acc
  },
  {} as Record<ENV_KEYS, string>,
)

// Projects to skip test
export const SKIP_PROJECTS = ENV[ENV_KEYS.SKIP_PROJECTS]
  .split(',')
  .map((project) => project.trim())
  .filter((project) => project !== '')

// Projects to run test
export const ONLY_PROJECTS = ENV[ENV_KEYS.ONLY_PROJECTS]
  .split(',')
  .map((project) => project.trim())
  .filter((project) => project !== '')

// Test data
export const DATA_PREFIX = 'E2E_DATA_' // prefix of environment variables for test data
export const DATA_DIR = './src/features' // features folder
// Auth
export const AUTH_DIR = '.auth' // auth folder

export const FEATURES_NEED_METAMASK = ENV[ENV_KEYS.NEEDS_METAMASK]
  .split(',')
  .map((feature) => feature.trim())
  .filter((feature) => !!feature)

export const PK_ACCOUNTS = [ENV[ENV_KEYS.PK_ACCOUNT_1], ENV[ENV_KEYS.PK_ACCOUNT_2], ENV[ENV_KEYS.PK_ACCOUNT_3]].filter(
  (feature) => !!feature,
)

export const DEFAULT_PK = 'test test test test test test test test test test test junk'
export const DEFAULT_PASSWORD = 'Volta@123'
