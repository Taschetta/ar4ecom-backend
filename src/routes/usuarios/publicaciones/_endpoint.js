import fs from 'fs'

export default ({ $publicaciones, $images }) => ({

  async findMany(request) {
    let fkUsuario, items
    fkUsuario = request.auth.payload.id
    items = await $publicaciones.findMany({ fkUsuario })
    return items
  },

  async findOne(request) {
    const id = request.params.id
    const fkUsuario = request.auth.payload.id

    let item = await $publicaciones.findOne({ id, fkUsuario })

    if (item) {
      item.imagenes = $images.findMany(`publicaciones/${item.id}/imagenes`)
    }

    if (!item) {
      item = {
        titulo: '',
        descripcion: '',
        etiquetas: '',
        privado: false,
      }
    }

    return item
  },

  async insert(request) {
    let item

    item = request.body
    item.fkUsuario = request.auth.payload.id
    item.fechaActualizado = new Date(Date.now())

    item.prePublicacion = JSON.parse(fs.readFileSync(request.files.prePublicacion[0].path))
    item.prePublicacion.titulo = item.titulo
    item.prePublicacion.descripcion = item.descripcion
    item.prePublicacion = JSON.stringify(item.prePublicacion)

    item.id = await $publicaciones.insertOne(item)
    item = await $publicaciones.findOne({ id: item.id })

    fs.mkdirSync(`files/publicaciones/${item.id}`)

    if (request.files.imagenes) {
      $images.insertMany(`publicaciones/${item.id}/imagenes`, request.files.imagenes)
    }

    fs.renameSync(request.files.bundleAndroid[0].path, `files/publicaciones/${item.id}/${item.id}_android`)
    fs.renameSync(request.files.bundleIOS[0].path, `files/publicaciones/${item.id}/${item.id}_ios`)

    fs.unlinkSync(request.files.prePublicacion[0].path)

    return item
  },

  async update(request) {
    let id = request.params.id
    let fkUsuario = request.auth.payload.id
    let update = request.body

    // Find item from database

    let publicacion = await $publicaciones.findOne({ id, fkUsuario })

    if (!publicacion) {
      throw new Error('No se encontró la publicación')
    }

    // Update fields from request

    if (update.privado === true || update.privado === false) {
      publicacion.privado = update.privado
    }

    if (update.titulo) {
      publicacion.titulo = update.titulo
    }

    if (update.descripcion) {
      publicacion.descripcion = update.descripcion
    }

    if (update.etiquetas) {
      publicacion.etiquetas = update.etiquetas
    }

    // If a prePublicacion file is set
    // - read it an override publicacion.prePublicacion with it
    // - delete the file

    if (request.files?.prePublicacion) {
      publicacion.prePublicacion = fs.readFileSync(request.files.prePublicacion[0].path)
      fs.unlinkSync(request.files.prePublicacion[0].path)
    }

    // Parse, override titulo and descripcion, and stringify again

    publicacion.prePublicacion = JSON.parse(publicacion.prePublicacion)
    publicacion.prePublicacion.titulo = publicacion.titulo
    publicacion.prePublicacion.descripcion = publicacion.descripcion
    publicacion.prePublicacion = JSON.stringify(publicacion.prePublicacion)

    // Set fechaActualizado to now

    publicacion.fechaActualizado = new Date(Date.now())

    // Update the item

    await $publicaciones.updateOne({ id, fkUsuario }, publicacion)

    // if the item had images saved

    if (update.imagenesGuardadas) {
      const imagenes = update.imagenesGuardadas.map((image) => image.split('/').pop())
      $images.removeNotIn(`publicaciones/${publicacion.id}/imagenes`, imagenes)
    }

    // if images are set on the request, save them

    if (request.files?.imagenes) {
      $images.insertMany(`publicaciones/${publicacion.id}/imagenes`, request.files.imagenes)
    }

    // if a bundleAndroid file is set on the request, override the previous one

    if (request.files?.bundleAndroid) {
      fs.renameSync(request.files.bundleAndroid[0].path, `files/publicaciones/${publicacion.id}/${publicacion.id}_android`)
    }

    // if a bundleIOS file is set on the request, override the previous one

    if (request.files?.bundleIOS) {
      fs.renameSync(request.files.bundleIOS[0].path, `files/publicaciones/${publicacion.id}/${publicacion.id}_ios`)
    }

    // Get back the publicacion

    publicacion = await $publicaciones.findOne({ id: publicacion.id })

    return publicacion || {}
  },

  async remove(request) {
    const id = request.params.id
    const fkUsuario = request.auth.payload.id

    // Remove from database

    const result = await $publicaciones.removeOne({ id, fkUsuario })

    // Remove files

    const path = `files/publicaciones/${id}`

    if (fs.existsSync(path)) {
      fs.rmSync(path, { recursive: true })
    }

    return result
  },

})
