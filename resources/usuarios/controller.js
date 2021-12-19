import { makeController } from '@packages/controller'

export default ({ $hash }) => makeController({
  table: 'usuario',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      nombre: { type: 'string' },
      email: { type: 'string' },
      contraseña: { type: 'string' },
      activo: { type: 'boolean' },
    },
    required: [
      'nombre', 'email',
    ],
    additionalProperties: false,
  },
  format: {
    async clean(item) {
      item.contraseña = await $hash.make(item.contraseña)
      return item
    },
    fill(item) {
      item.activo = !!item.activo
      delete item.contraseña
      return item
    },
  },
})
