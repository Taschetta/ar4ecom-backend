
export default ({ $hash, $table }) => ({

  async insertOne(request) {
    let id, item

    item = request.body
    item.contraseña = await $hash.make(item.contraseña)

    id = await $table.insertOne(request.body)

    item = await $table.findOne({ id })

    return item
  },

})
