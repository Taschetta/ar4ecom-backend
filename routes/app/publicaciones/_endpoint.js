
export default ({ $publicaciones }) => ({

  async findMany() {
    return $publicaciones.findMany()
  },

  async findOne(request) {
    const id = parseInt(request.params.id)
    return $publicaciones.findOne({ id })
  },

})
