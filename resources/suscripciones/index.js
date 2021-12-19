import { useTable } from '@packages/table'
import useSuscripciones from './controller.js'

const $table = useTable('suscripcion')

export default ({ $publicaciones, $usuarios }) => useSuscripciones({ $table, $publicaciones, $usuarios })
