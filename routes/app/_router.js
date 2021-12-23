import { useRouter } from '@packages/router'

export default ({ $publicaciones, $suscripciones }) => useRouter({
  '/publicaciones': $publicaciones,
  '/suscripciones': $suscripciones,
})
