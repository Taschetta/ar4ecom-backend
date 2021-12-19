import { middleware as admin } from '@packages/auth'
import { useRouter } from '@packages/router'

import publicaciones from './publicaciones/index.js'
import suscripciones from './suscripciones/index.js'

export default ({ endpoint }) => useRouter({
  '/publicaciones': publicaciones,
  '/suscripciones': suscripciones,
  '/': {
    patch: [ admin, endpoint.update ],
    get: [ admin, endpoint.find ],
    post: endpoint.insert,
  },
})
