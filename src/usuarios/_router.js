import { useRouter } from '@packages/router'

export default ({ endpoint }) => useRouter({
  '/': {
    post: endpoint.insertOne,
  },
})
