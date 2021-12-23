import { useRouter } from '@packages/router'
import { auth } from '@packages/auth'

const authed = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    throw new Error('el header authorization no esta definido')
  }

  const prefix = authorization.split(' ')[0]
  const token = authorization.split(' ')[1]

  if (prefix.toLowerCase() !== 'bearer') {
    throw new Error('el encabezado de autorizacion no cumple con el formato requerido')
  }

  let payload

  try {
    payload = auth.decode(token)
  } catch {
    throw new Error('el token provisto no es valido')
  }

  if (payload.name !== process.env.AUTH_APP_TOKEN) {
    throw new Error('el token provisto no es valido')
  }

  next()
}

export default ({ endpoint }) => useRouter({
  '/:id': {
    get: [ authed, endpoint.findOne ],
  },
  '/': {
    get: [ authed, endpoint.findMany ],
  },
})
