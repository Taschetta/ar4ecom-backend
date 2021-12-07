import { middleware as admin } from '@packages/auth'
import { useRouter } from '@packages/router'

export default ({ endpoint }) => useRouter({
  '/': {
    post: endpoint.login,
    patch: endpoint.refresh,
    delete: [admin, endpoint.logout],
  },
})
