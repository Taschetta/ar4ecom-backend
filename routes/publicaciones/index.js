import { $publicaciones } from '@app/resources'

import { images as $images } from '@packages/files'
import useTable from '@packages/table'

import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

const $usuarios = useTable('usuario')

export const endpoint = useEndpoint({ $publicaciones, $usuarios, $images })
export const router = useRouter({ endpoint })

export default router
