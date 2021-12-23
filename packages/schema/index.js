import Ajv from 'ajv'
import config from './src/schema.js'

export const ajv = new Ajv({ allowUnionTypes: true })
export const useSchema = config({ ajv })
export default useSchema
