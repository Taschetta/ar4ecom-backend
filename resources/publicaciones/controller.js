import fs from 'fs'

export const usePublicaciones = ({ $table, $imagenes, $usuarios, images }) => ({

  async findMany(query) {
    let items

    // Load all public items

    items = await $table.findMany(query)

    // Add relations to items

    items = items.map(async (item) => {
      // load images for the item from /files/publicaciones/:id folder

      item.imagenes = await $imagenes.findMany({ fkPublicacion: item.id })

      // load item's user

      item.usuario = await $usuarios.findOne({ id: item.fkUsuario })

      // parse the prePublicacion field

      item.prePublicacion = JSON.parse(item.prePublicacion)

      // return the item

      return item
    })

    // Await for all promises to resolve from the async items.map

    items = await Promise.all(items)

    // return items

    return items
  },

  async findOne(query) {
    const item = await $table.findOne(query)

    // if item was not found => throw error

    if (!item) {
      throw new Error('No se encontró la publicación')
    }

    // load images for the item from /files/publicaciones/:id folder

    item.imagenes = await $imagenes.findMany({ fkPublicacion: item.id })

    // load item's user

    item.usuario = await $usuarios.findOne({ id: item.fkUsuario })

    // parse the prePublicacion field

    item.prePublicacion = JSON.parse(item.prePublicacion)

    // return the item

    return item
  },

  async insertOne({ fkUsuario, privado = true, titulo, descripcion, etiquetas, prePublicacion, imagenes, bundleAndroid, bundleIOS }) {

    // Validation

    if (!fkUsuario) {
      throw new Error('Falta fkUsuario')
    }

    if (!titulo) {
      throw new Error('Falta el titulo')
    }

    if (!descripcion) {
      throw new Error('Falta la descripción')
    }

    if (!etiquetas) {
      throw new Error('Faltan las etiquetas')
    }

    if (!prePublicacion) {
      throw new Error('Falta la prePubliacion')
    }

    // parse prePublicacion

    const path = prePublicacion.path

    prePublicacion = JSON.parse(fs.readFileSync(path))

    prePublicacion.titulo = titulo
    prePublicacion.descripcion = descripcion
    prePublicacion.etiquetas = etiquetas

    // set publicacion to insert

    const publicacion = {
      fkUsuario,
      titulo,
      descripcion,
      etiquetas: JSON.stringify(etiquetas),
      prePublicacion: JSON.stringify(prePublicacion),
      fechaActualizado: new Date(Date.now()),
    }

    // insert

    const id = await $table.insertOne(publicacion)

    fs.mkdirSync(`files/publicaciones/${id}`)

    fs.renameSync(bundleAndroid.path, `files/publicaciones/${id}/${id}_android`)
    fs.renameSync(bundleIOS.path, `files/publicaciones/${id}/${id}_ios`)

    if (imagenes) {
      $imagenes.insertMany(imagenes, { fkPublicacion: id })
    }

    return id
  },

  async updateOne(query, { privado = true, titulo, descripcion, etiquetas, prePublicacion, imagenesGuardadas, imagenes, bundleAndroid, bundleIOS }) {
    // Find item from database

    let publicacion = await $table.findOne(query)

    if (!publicacion) {
      throw new Error('No se encontró la publicación')
    }

    // Update fields from request

    let update = {}

    if (prePublicacion) {
      update.prePublicacion = fs.readFileSync(prePublicacion.path)
      fs.unlinkSync(prePublicacion.path)
    } else {
      update.prePublicacion = publicacion.prePublicacion
    }

    update.prePublicacion = JSON.parse(update.prePublicacion)

    if (privado === true || privado === false) {
      update.privado = privado
    }

    if (titulo) {
      update.titulo = titulo
      update.prePublicacion.titulo = titulo
    }

    if (descripcion) {
      update.descripcion = descripcion
      update.prePublicacion.descripcion = descripcion
    }

    if (etiquetas) {
      update.etiquetas = JSON.stringify(etiquetas)
      update.prePublicacion.etiquetas = etiquetas
    }

    update.prePublicacion = JSON.stringify(update.prePublicacion)

    // Set fechaActualizado to now

    publicacion.fechaActualizado = new Date(Date.now())

    // Update the item

    const result = await $table.updateOne(query, update)

    // if the item had images saved

    if (imagenesGuardadas) {
      const imagenes = imagenesGuardadas.map((image) => image.split('/').pop())
      images.removeNotIn(`publicaciones/${publicacion.id}/imagenes`, imagenes)
    }

    // if images are set on the request, save them

    if (imagenes) {
      images.insertMany(`publicaciones/${publicacion.id}/imagenes`, imagenes)
    }

    // if a bundleAndroid file is set on the request, override the previous one

    if (bundleAndroid) {
      fs.renameSync(bundleAndroid.path, `files/publicaciones/${publicacion.id}/${publicacion.id}_android`)
    }

    // if a bundleIOS file is set on the request, override the previous one

    if (bundleIOS) {
      fs.renameSync(bundleIOS.path, `files/publicaciones/${publicacion.id}/${publicacion.id}_ios`)
    }

    // Get back the publicacion

    return result
  },

  async removeOne(query) {

    // find

    let publicacion = await $table.findOne(query)

    if (!publicacion) {
      throw new Error('No se encontró la publicación')
    }

    // remove

    const result = await $table.removeOne({ id: publicacion.id })

    // Remove files

    const path = `files/publicaciones/${publicacion.id}`

    if (fs.existsSync(path)) {
      fs.rmSync(path, { recursive: true })
    }

    return result
  },

})
