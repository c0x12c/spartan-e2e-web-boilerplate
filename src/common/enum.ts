export enum ENV_KEYS {
  // Run options
  SKIP_PROJECTS = 'E2E_SKIP_PROJECTS',
  ONLY_PROJECTS = 'E2E_ONLY_PROJECTS',

  // Test settings
  BASE_URL = 'E2E_BASE_URL',
  PK_ACCOUNT_1 = 'PK_ACCOUNT_1',
  PK_ACCOUNT_2 = 'PK_ACCOUNT_2',
  PK_ACCOUNT_3 = 'PK_ACCOUNT_3',
  NEEDS_METAMASK = 'NEEDS_METAMASK',

  // Test data environment variables are existed but not defined here
}

export enum TIMEOUT {
  XSHORT = 2000,
  SHORT = 5000,
  MEDIUM = 10000,
  LONG = 30000,
  XLONG = 60000,
}

export enum DATA_PATHS {
  // Test data file paths, relative to features folder
  USER = '/auth/user.local.json',
  WALLET = '/connect-wallet/wallet.local.json',
}

export enum LOGIN_PAGE {
  PATH = '/auth',
  KEY_USERNAME = 'email',
  KEY_PASSWORD = 'password',
  INPUT_USERNAME = 'Email',
  INPUT_PASSWORD = 'Password',
}

export enum ADDRESS_PAGE {
  PATH = '/address-book',
  KEY_ADDRESS_NAME = '.name',
  KEY_ADDRESS = '.address',
  KEY_CHAIN = '.chain',
  INPUT_ADDRESS_NAME = 'Email',
  INPUT_ADDRESS = 'Password',
  INPUT_CHAIN = 'Password',
  BUTTON_SAVE = 'Save',
}

export enum PROGRAMMATIC_ADDRESS_PAGE {
  PATH = '/wallets',
}

export enum HOME_PAGE {
  PATH = '/',
}

export enum CONNECT_WALLET {
  KEY_ADDRESS = 'address',
  KEY_CONNECT = 'Connect Wallet',
  KEY_PROVIDER = 'MetaMask',
}

export enum CREATE_VAULT_PAGE {
  PATH = '/create-vault',
}
