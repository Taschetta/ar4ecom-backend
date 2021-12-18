import express from 'express'
import { useApp } from '@packages/router'

import publicaciones from './publicaciones/index.js'
import sesion from './sesion/index.js'
import usuarios from './usuarios/index.js'

export default useApp({
  '/publicaciones': publicaciones,
  '/sesion': sesion,
  '/usuarios': usuarios,
  '/files': express.static('files'),
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
      case 'AuthenticationFailedError':
        res.status(401).send({ success: false, message: error.message })
        break
      default:
        res.status(500).send({ success: false, message: error.message || 'Error interno' })
        break
    }
  },
})
