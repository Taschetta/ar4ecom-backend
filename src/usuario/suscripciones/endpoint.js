
export default ({ $suscripciones, $publicaciones }) => ({

  async findMany(request) {
    // request data
    const fkUsuario = request.auth.payload.id

    // load items
    const items = await $suscripciones.findMany({ fkUsuario })

    // return them
    return items
  },

  async findOne(request) {
    // request data
    const id = request.params.id
    const fkUsuario = request.auth.payload.id

    // load item
    const item = await $suscripciones.findOne({ id, fkUsuario })

    // if item is null => throw
    if (!item) {
      throw new Error('No se encontró la suscripción')
    }

    // else => return it
    return item
  },

  async insert(request) {
    // get data from request
    const { fkPublicacion, info, etiqueta_url, url_suscriptor } = request.body
    const fkUsuario = request.auth.payload.id

    // check publicacion permissions
    const publicacion = await $publicaciones.find({ id: fkPublicacion, privado: 0 })

    if (!publicacion) {
      throw new Error('No se encontró la publicación')
    }

    // set item data
    let item = {
      fkUsuario,
      fkPublicacion,
      info,
      etiqueta_url,
      url_suscriptor,
      fechaAlta: new Date(Date.now()),
    }

    // insert item
    const id = await $suscripciones.insertOne(item)

    // get item
    item = await $suscripciones.findOne({ id })

    // return it
    return item
  },

  async update(request) {
    // request data
    const { info, etiqueta_url, url_suscriptor, notas } = request.body

    const id = request.params.id
    const fkUsuario = request.auth.payload.id

    // load item
    const item = await $suscripciones.findOne({ id, fkUsuario })

    // if item is null => throw
    if (!item) {
      throw new Error('No se encontró la suscripción')
    }

    // set update data
    const update = {}

    if (info) {
      update.info = info
    }

    if (etiqueta_url) {
      update.etiqueta_url = etiqueta_url
    }

    if (url_suscriptor) {
      update.url_suscriptor = url_suscriptor
    }

    if (notas) {
      update.notas = notas
    }

    // update item
    await $suscripciones.updateOne({ id, fkUsuario }, update)

    // return it
    return $suscripciones.findOne({ id })
  },

  async remove(request) {
    // request data
    const id = parseInt(request.params.id)
    const fkUsuario = parseInt(request.auth.payload.id)

    // Remove from database
    const result = await $suscripciones.removeOne({ id, fkUsuario })

    return result
  },

})
