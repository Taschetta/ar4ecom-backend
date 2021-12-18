
export default ({ $publicaciones }) => ({

  async findMany(request) {
    // Request data
    const fkUsuario = parseInt(request.auth.payload.id)

    // Find publicaciones
    const items = await $publicaciones.findMany({ fkUsuario })
    // Return
    return items
  },

  async findOne(request) {
    // Request data
    const id = parseInt(request.params.id)
    const fkUsuario = parseInt(request.auth.payload.id)

    if (id === 0) {
      return {
        titulo: '',
        descripcion: '',
        etiquetas: '',
        privado: false,
      }
    }

    // Find item
    let item = await $publicaciones.findOne({ id, fkUsuario })

    return item
  },

  async insert(request) {
    const item = request.body

    item.fkUsuario = request.auth.payload.id
    item.prePublicacion = request.files.prePublicacion[0]
    item.bundleAndroid = request.files.bundleAndroid[0]
    item.bundleIOS = request.files.bundleIOS[0]
    item.imagenes = request.files.imagenes

    const id = await $publicaciones.insertOne(item)

    return $publicaciones.findOne({ id })
  },

  async update(request) {
    const query = {}

    query.id = parseInt(request.params.id)
    query.fkUsuario = parseInt(request.auth.payload.id)

    const update = request.body

    update.prePublicacion = request.files?.prePublicacion?.[0]
    update.bundleAndroid = request.files?.bundleAndroid?.[0]
    update.bundleIOS = request.files?.bundleIOS?.[0]
    update.imagenes = request.files?.imagenes

    await $publicaciones.updateOne(query, update)

    return $publicaciones.findOne(query)
  },

  async remove(request) {
    const id = request.params.id
    const fkUsuario = request.auth.payload.id
    return $publicaciones.removeOne({ id, fkUsuario })
  },

})
