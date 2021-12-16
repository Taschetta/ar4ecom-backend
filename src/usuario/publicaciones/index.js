import { images as $images } from '@packages/files'

import useTable from '@packages/table'
import useEndpoint from './_endpoint.js'
import useRouter from './_router.js'

export const $publicaciones = useTable('publicacion')

export const $endpoint = useEndpoint({ $publicaciones, $images })
export const $router = useRouter({ $endpoint })

export default $router
