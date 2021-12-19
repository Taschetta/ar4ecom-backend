import { useTable } from '@packages/table'
import useSuscripciones from './controller.js'

const $table = useTable('suscripcion')

export default ({ $publicaciones }) => useSuscripciones({ $table, $publicaciones })
