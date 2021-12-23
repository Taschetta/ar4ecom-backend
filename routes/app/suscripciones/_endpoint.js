
export default ({ $suscripciones }) => ({

  async findMany() {
    return $suscripciones.findMany()
  },

  async findOne(request) {
    const id = parseInt(request.params.id)
    return $suscripciones.findOne({ id })
  },

})
