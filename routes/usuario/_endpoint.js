
export default ({ $usuarios }) => ({

  async findOne(request) {
    // Request data
    const id = parseInt(request.auth.payload.id)
    // Find
    return $usuarios.findOne({ id })
  },

  async insert(request) {
    // Request data
    const data = request.body

    // Insert
    const id = await $usuarios.insertOne(data)

    // Find
    const item = await $usuarios.findOne({ id })

    // Return
    return item
  },

  async update(request) {
    // Request data
    const id = parseInt(request.auth.payload.id)
    const update = request.body

    // Update
    // ($updateOne returns true or false depending on if any item was updated)
    const updated = await $usuarios.updateOne({ id }, update)

    // Throw if no item was updated
    if (!updated) {
      throw new Error('No se encontro el usuario para actualizar')
    }

    // Return item
    return $usuarios.findOne({ id })
  },

})
