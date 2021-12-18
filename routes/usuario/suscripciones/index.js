import { middleware as authed } from '@packages/auth'
import { useRouter } from '@packages/router'
import useTable from '@packages/table'

import useEndpoint from './endpoint.js'

const $suscripciones = useTable('suscripcion')
const $publicaciones = useTable('publicacion')

export const endpoint = useEndpoint({ $suscripciones, $publicaciones })

export default useRouter({
  '/:id': {
    get: [ authed, endpoint.findOne ],
    patch: [ authed, endpoint.update ],
    delete: [ authed, endpoint.remove ],
  },
  '/': {
    get: [ authed, endpoint.findMany ],
    post: [ authed, endpoint.insert ],
  },
})
