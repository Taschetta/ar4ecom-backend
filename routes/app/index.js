import $publicaciones from './publicaciones/index.js'
import $suscripciones from './suscripciones/index.js'

import useRouter from './_router.js'

export const router = useRouter({ $publicaciones, $suscripciones })

export default router
