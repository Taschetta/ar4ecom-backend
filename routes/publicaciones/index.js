import { $publicaciones } from '@app/resources'

import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

export const endpoint = useEndpoint({ $publicaciones })
export const router = useRouter({ endpoint })

export default router
