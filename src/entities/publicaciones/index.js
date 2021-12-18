import { images } from '@packages/files'
import { useTable } from '@packages/table'
import { usePublicaciones } from './controller.js'

import $imagenes from './imagenes/index.js'

const $table = useTable('publicacion')

export default ({ $usuarios }) => usePublicaciones({ $table, $usuarios, $imagenes, images })
