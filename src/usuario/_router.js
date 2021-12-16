import { middleware as admin } from '@packages/auth'
import { useRouter } from '@packages/router'

import publicaciones from './publicaciones/index.js'

export default ({ endpoint }) => useRouter({
  '/publicaciones': publicaciones,
  '/': {
    get: [ admin, endpoint.find ],
    patch: [ admin, endpoint.update ],
    post: endpoint.insert,
  },
})
