
export default ({ $publicaciones, $usuarios, $images }) => ({

  async findMany() {
    let items

    // Load all public items

    items = await $publicaciones.findMany({ privado: 0 })

    // Add username to items

    items = items.map(async (item) => {
      const usuario = await $usuarios.findOne({ id: item.fkUsuario })
      item.usuario = usuario.nombre
      return item
    })

    // Await for all promises to resolve from the async items.map

    items = await Promise.all(items)

    // return items

    return items
  },

  async findOne(request) {
    // Get id from params

    const id = request.params.id

    // if id is 0 => return new item

    if (id === 0) {
      return {
        titulo: '',
        descripcion: '',
        etiquetas: '',
        privado: false,
      }
    }

    // else => find item

    const item = await $publicaciones.findOne({ id, privado: 0 })

    // if item was not found => throw error

    if (!item) {
      throw new Error('No se encontró la publicación')
    }

    // else => load images for the item from /files/publicaciones/:id folder

    item.imagenes = $images.findMany(`publicaciones/${item.id}/imagenes`)

    // then => return the item

    return item
  },

})
