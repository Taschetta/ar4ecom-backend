
export default ({ $table, $publicaciones, $usuarios }) => ({

  async findMany(query) {
    // Data

    let items

    // Action

    items = await $table.findMany(query)

    // Format

    items = items.map(async (item) => {
      item.publicacion = await $publicaciones.findOne({ id: item.fkPublicacion })
      item.usuario = await $usuarios.findOne({ id: item.fkUsuario })
      return item
    })

    items = await Promise.all(items)

    return items
  },

  async findOne(query) {
    const item = await $table.findOne(query)

    if (!item) {
      throw new Error('No se encontró la suscripción')
    }

    item.publicacion = await $publicaciones.findOne({ id: item.fkPublicacion })
    item.usuario = await $usuarios.findOne({ id: item.fkUsuario })

    return item
  },

  async insertOne({ fkUsuario, fkPublicacion, info, etiqueta_url, url_suscriptor }) {
    // Auth

    const publicacion = await $publicaciones.findOne({ id: fkPublicacion, privado: 0 })

    if (!publicacion) {
      throw new Error('No se encontró la publicación')
    }

    // Action

    return $table.insertOne({
      fkUsuario,
      fkPublicacion,
      info,
      etiqueta_url,
      url_suscriptor,
      fechaAlta: new Date(Date.now()),
    })
  },

  async updateOne(query, { info, etiqueta_url, url_suscriptor, notas }) {
    // Find

    const item = await $table.findOne(query)

    if (!item) {
      throw new Error('No se encontró la suscripción')
    }

    // Set update data

    item.info = info
    item.etiqueta_url = etiqueta_url
    item.url_suscriptor = url_suscriptor
    item.notas = notas

    // Action

    return $table.updateOne(query, item)
  },

  async removeOne(query) {
    return $table.removeOne(query)
  },

})
