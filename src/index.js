import { useApp } from '@packages/router'

export default useApp({
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
        res.status(500).send({ success: false, message: 'Error interno' })
        break
    }
  },
})
