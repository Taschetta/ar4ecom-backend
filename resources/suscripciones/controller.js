import { makeController } from '@packages/controller'

export default ({ $publicaciones, $usuarios }) => makeController({
  table: 'suscripcion',
  schema: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
      fkUsuario: {
        type: 'integer',
      },
      fkPublicacion: {
        type: 'integer',
      },
      fechaAlta: {
        type: 'string',
      },
      info: {
        type: 'string',
        nullable: true,
      },
      etiqueta_url: {
        type: 'string',
        nullable: true,
      },
      url_suscriptor: {
        type: 'string',
        nullable: true,
      },
      notas: {
        type: 'string',
        nullable: true,
      },
      publicacion: {
        type: 'object',
      },
      usuario: {
        type: 'object',
      },
    },
    required: [
      'fkUsuario',
      'fkPublicacion',
    ],
    additionalProperties: false,
  },
  format: {
    async clean(item) {

      item.fechaAlta = item.fechaAlta
        ? new Date(item.fechaAlta)
        : new Date(Date.now())

      delete item.publicacion
      delete item.usuario

      return item
    },
    async fill(item) {
      item.publicacion = await $publicaciones.findOne({ id: item.fkPublicacion })
      item.usuario = await $usuarios.findOne({ id: item.fkUsuario })
      item.fechaAlta = new Date(item.fechaAlta)
      return item
    },
  },
  hooks: {
    async beforeInsert({ fkPublicacion }) {
      const publicacion = await $publicaciones.findOne({ id: fkPublicacion, privado: 0 })

      if (!publicacion) {
        throw new Error('No se encontró la publicación')
      }
    },
  },
})
