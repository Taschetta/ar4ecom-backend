import { middleware as authed } from '@packages/auth'
import { images as $images } from '@packages/files'
import { useRouter } from '@packages/router'
import useTable from '@packages/table'

import useEndpoint from './endpoint.js'

const $publicaciones = useTable('publicacion')
const $usuarios = useTable('usuario')

export const endpoint = useEndpoint({ $publicaciones, $usuarios, $images })

export default useRouter({
  '/:id': {
    get: [ authed, endpoint.findOne ],
  },
  '/': {
    get: [ authed, endpoint.findMany ],
  },
})
