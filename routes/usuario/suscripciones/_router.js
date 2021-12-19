import { middleware as authed } from '@packages/auth'
import { useRouter } from '@packages/router'

export default ({ endpoint }) => useRouter({
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
