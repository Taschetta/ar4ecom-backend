import { $usuarios } from '@app/resources'

import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

export const endpoint = useEndpoint({ $usuarios })
export const router = useRouter({ endpoint })

export default router
