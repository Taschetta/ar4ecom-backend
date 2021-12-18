import auth from '@packages/auth'
import hash from '@packages/hash'

import useTable from '@packages/table'
import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

const usuarios = useTable('usuario')
const sesiones = useTable('sesion')
const endpoint = useEndpoint({ auth, hash, usuarios, sesiones })
const router = useRouter({ endpoint })

export default router
