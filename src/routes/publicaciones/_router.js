import { middleware as authed } from '@packages/auth'
import { useRouter } from '@packages/router'

export default ({ endpoint }) => useRouter({
  '/:id': {
    get: [ authed, endpoint.findOne ],
  },
  '/': {
    get: [ authed, endpoint.findMany ],
  },
})
