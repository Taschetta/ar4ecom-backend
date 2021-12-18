
export default ({ $hash, $table }) => ({

  async findOne(query) {

    // Find usuario

    const usuario = await $table.findOne(query)

    // Throw if not found

    if (!usuario) {
      throw new Error('No se encontró el usuario')
    }

    // Format

    delete usuario.contraseña

    // Return

    return usuario
  },

  async insertOne({ nombre, email, contraseña, activo = true }) {

    // Validation

    if (!nombre) {
      throw new Error('Falta el nombre')
    }

    if (!email) {
      throw new Error('Falta el email')
    }

    if (!contraseña) {
      throw new Error('Falta la contraseña')
    }

    // Format

    contraseña = await $hash.make(contraseña)

    // insertOne

    return $table.insertOne({ nombre, email, contraseña, activo })
  },

  async updateOne(query, { nombre, email, contraseña, activo }) {

    // Format

    const update = {}

    if (nombre) {
      update.nombre = nombre
    }

    if (email) {
      update.email = email
    }

    if (contraseña) {
      update.contraseña = await $hash.make(contraseña)
    }

    if (activo === true || activo === false) {
      update.activo = activo
    }

    // Update

    return $table.updateOne(query, update)
  },

})
