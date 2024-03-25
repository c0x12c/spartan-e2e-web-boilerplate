import path from 'path'
import { parseFileToJson } from '../utils'
import { CommonData } from './common'
import { SecretsData } from './secrets'

/**
 * Secrets data.
 */
export class SecretsDataProvider {
  public secretsData?: SecretsData | null

  constructor() {
    console.log('Reading secrets.json')
    const secretPath = path.join(process.cwd(), 'src', 'secrets.json')
    this.secretsData = parseFileToJson(secretPath)
  }
}

/**
 *  Variables shared between steps should be defined here.
 */
export class CommonDataProvider {
  public commonData: CommonData = {}

  constructor() {
    console.log('Reading common.json')
    const secretPath = path.join(process.cwd(), 'src', 'common.json')
    this.commonData = parseFileToJson(secretPath)
  }
}

export class LocalStorageItem {
  constructor(
    public name: string,
    public value: string,
  ) {}
}
export class LocalStorageData {
  constructor(
    public origin: string,
    public localStorage: Array<LocalStorageItem>,
  ) {}
}
