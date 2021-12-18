import { $publicaciones } from '@app/resources'

import { images as $images } from '@packages/files'

import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

export const $endpoint = useEndpoint({ $publicaciones, $images })
export const $router = useRouter({ $endpoint })

export default $router
