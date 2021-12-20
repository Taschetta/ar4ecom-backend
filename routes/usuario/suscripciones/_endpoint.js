
export default ({ $suscripciones, $publicaciones }) => ({

  async findMany(request) {
    // Data
    const fkUsuario = parseInt(request.auth.payload.id)

    // Action
    return $suscripciones.findMany({ fkUsuario })
  },

  async findOne(request) {
    // Data
    const id = parseInt(request.params.id)
    const fkUsuario = parseInt(request.auth.payload.id)

    // Action
    return $suscripciones.findOne({ id, fkUsuario })
  },

  async insert(request) {
    // Data
    const suscripcion = request.body
    suscripcion.fkUsuario = parseInt(request.auth.payload.id)

    // Action
    const id = await $suscripciones.insertOne(suscripcion)

    // Return
    return $suscripciones.findOne({ id })
  },

  async update(request) {
    // Data
    const update = request.body
    const id = parseInt(request.params.id)
    const fkUsuario = parseInt(request.auth.payload.id)

    // Action
    await $suscripciones.updateOne({ id, fkUsuario }, update)

    // Return
    return $suscripciones.findOne({ id })
  },

  async remove(request) {
    // Data
    const id = parseInt(request.params.id)
    const fkUsuario = parseInt(request.auth.payload.id)

    // Action
    return $suscripciones.removeOne({ id, fkUsuario })
  },

})
