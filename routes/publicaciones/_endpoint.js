
export default ({ $publicaciones }) => ({

  async findMany() {
    return $publicaciones.findMany({ privado: 0 })
  },

  async findOne(request) {
    const id = parseInt(request.params.id)

    if (id === 0) {
      return {
        titulo: '',
        descripcion: '',
        etiquetas: '',
        privado: false,
      }
    }

    return $publicaciones.findOne({ id, privado: 0 })
  },

})
