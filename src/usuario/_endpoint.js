
export default ({ $hash, $table }) => ({

  async find(request) {
    const id = request.auth.payload.id
    const user = await $table.findOne({ id })
    delete user.contraseña
    return user
  },

  async insert(request) {
    let id, item

    item = request.body
    item.contraseña = await $hash.make(item.contraseña)

    id = await $table.insertOne(request.body)

    item = await $table.findOne({ id })

    return item
  },

  async update(request) {
    const { id, ...item } = request.body

    if (item.contraseña) {
      item.contraseña = await $hash.make(item.contraseña)
    }

    await $table.updateOne({ id }, item)

    return $table.findOne({ id })
  },

})
