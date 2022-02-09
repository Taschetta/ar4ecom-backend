import { UnauthorizedError, BadRequestError } from '../_errors.js'

export default ({ auth, hash, sesiones, usuarios }) => ({

  async login(request) {
    const { nombre, contraseña } = request.body

    if (!nombre) {
      throw new BadRequestError('Falta el nombre de usuario')
    }

    if (!contraseña) {
      throw new BadRequestError('Falta la contraseña')
    }

    const usuario = await usuarios.findOne({ nombre })

    if (!usuario) {
      throw new BadRequestError('No hay ningun usuario con este nombre')
    }

    const match = await hash.check(contraseña, usuario.contraseña)

    if (!match) {
      throw new BadRequestError('La contraseña es incorrecta')
    }

    const accessToken = auth.generate({ id: usuario.id, type: 'access' }, { expiration: 3600 })
    const refreshToken = auth.generate({ id: usuario.id, type: 'refresh' }, { expiration: 6000 })

    await sesiones.removeMany({ fkusuario: usuario.id })
    await sesiones.insertOne({ fkusuario: usuario.id, token: refreshToken })

    delete usuario.contraseña

    return {
      accessToken,
      refreshToken,
      usuario,
    }
  },

  async logout(request) {
    const fkusuario = request.auth.payload.id
    await sesiones.removeMany({ fkusuario })
    return {
      success: true,
      message: 'Se cerró la sesión',
    }
  },

  async refresh(request) {
    const { authorization } = request.headers

    const headerToken = authorization.split(' ')[1]

    const payload = auth.decode(headerToken)

    if (payload.type !== 'refresh') {
      throw new UnauthorizedError('El token provisto es invalido')
    }

    const session = await sesiones.findOne({ fkusuario: payload.id })

    if (!session || session.token !== headerToken) {
      throw new UnauthorizedError('El token provisto esta vencido')
    }

    const usuario = await usuarios.findOne({ id: payload.id })

    delete usuario.contraseña

    const accessToken = auth.generate({ id: payload.id, type: 'access' }, { expiration: 3600 })
    const refreshToken = auth.generate({ id: payload.id, type: 'refresh' }, { expiration: 6000 })

    await sesiones.removeMany({ fkusuario: payload.id })
    await sesiones.insertOne({ fkusuario: payload.id, token: refreshToken })

    return {
      accessToken,
      refreshToken,
      usuario,
    }
  },

})
