import $hash from '@packages/hash'

import useTable from '@packages/table'
import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

export const table = useTable('usuario')
export const endpoint = useEndpoint({ $table: table, $hash })
export const router = useRouter({ endpoint })

export default router
