import $hash from '@packages/hash'
import useTable from '@packages/table'

import useUsuarios from './controller.js'

const $table = useTable('usuario')

export default useUsuarios({ $table, $hash })
