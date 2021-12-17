import { middleware as admin } from '@packages/auth'
import { useRouter } from '@packages/router'

import publicaciones from './publicaciones/index.js'
import suscripciones from './suscripciones/index.js'

export default ({ endpoint }) => useRouter({
  '/publicaciones': publicaciones,
  '/suscripciones': suscripciones,
  '/': {
    get: [ admin, endpoint.find ],
    patch: [ admin, endpoint.update ],
    post: endpoint.insert,
  },
})
