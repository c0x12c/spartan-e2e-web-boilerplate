import { SecretsDataProvider } from '../../common/types/data'
import { throwExpression } from '../../common/utils'

const testData = new SecretsDataProvider().secretsData ?? throwExpression('Secrets data not found or wrong format')
export default testData
