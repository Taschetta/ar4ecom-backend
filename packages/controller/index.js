import { useTable } from '@packages/table'
import { useSchema } from '@packages/schema'

import config from './src/controller.js'
import useFormatter from './src/formatter.js'

export const makeController = config({ useTable, useSchema, useFormatter })
export default makeController
