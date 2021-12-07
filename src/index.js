import { useApp } from '@packages/router'

import sesion from './sesion/index.js'

export default useApp({
  '/sesion': sesion,
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
      default:
        console.log(error)
        res.status(500).send({ success: false, message: 'Error interno' })
        break
    }
  },
})
