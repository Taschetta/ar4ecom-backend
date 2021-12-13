import { useApp } from '@packages/router'

import sesion from './sesion/index.js'
import usuarios from './usuarios/index.js'

export default useApp({
  '/sesion': sesion,
  '/usuarios': usuarios,
  '/': {
    get: () => {
      return {
        success: true,
        message: 'Bienvenido a la API de ar4ecom!',
      }
    },
  },
}, {
  errorHandler: (error, req, res, next) => {
    switch (error.name) {
      case 'BadRequestError':
        res.status(400).send({ success: false, message: error.message })
        break
      case 'UnauthorizedError':
        res.status(401).send({ success: false, message: error.message })
        break
      default:
        console.log(error)
        res.status(500).send({ success: false, message: 'Error interno' })
        break
    }
  },
})
