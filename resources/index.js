import usePublicaciones from './publicaciones/index.js'
import useSuscripciones from './suscripciones/index.js'
import useUsuarios from './usuarios/index.js'

export const $usuarios = useUsuarios()
export const $publicaciones = usePublicaciones({ $usuarios })
export const $suscripciones = useSuscripciones({ $usuarios, $publicaciones })
