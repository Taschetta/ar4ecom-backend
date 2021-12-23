import { makeController } from '@packages/controller'
import { connection as ftp } from '@packages/ftp'
import fs from 'fs'

export const usePublicaciones = ({ $imagenes, $usuarios, images }) => makeController({
  table: 'publicacion',
  schema: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
      fkUsuario: {
        type: 'integer',
      },
      privado: {
        type: 'boolean',
      },
      titulo: {
        type: 'string',
      },
      descripcion: {
        type: 'string',
      },
      etiquetas: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      prePublicacion: {
        type: 'object',
      },
      fechaActualizado: {
        type: ['string', 'object'],
      },
    },
    required: [
      'fkUsuario',
      'titulo',
      'descripcion',
      'etiquetas',
    ],
  },
  format: {
    async clean(item) {
      if (item.prePublicacion) {
        if (item.prePublicacion.path) {
          const path = item.prePublicacion.path
          item.prePublicacion = JSON.parse(fs.readFileSync(path))
          fs.unlinkSync(path)
        }

        item.prePublicacion.titulo = item.titulo
        item.prePublicacion.descripcion = item.descripcion
        item.prePublicacion.etiquetas = item.etiquetas

        item.prePublicacion = JSON.stringify(item.prePublicacion)
      }

      item.etiquetas = JSON.stringify(item.etiquetas)
      item.fechaActualizado = new Date(Date.now())

      delete item.imagenesGuardadas
      delete item.bundleAndroid
      delete item.bundleIOS
      delete item.imagenes
      delete item.usuario

      return item
    },
    async fill(item) {
      item.imagenesGuardadas = await $imagenes.findMany({ fkPublicacion: item.id })
      item.usuario = await $usuarios.findOne({ id: item.fkUsuario })
      item.etiquetas = JSON.parse(item.etiquetas)
      item.prePublicacion = JSON.parse(item.prePublicacion)
      item.privado = !!item.privado
      return item
    },
  },
  hooks: {
    async afterInsert({ id, imagenes, bundleAndroid, bundleIOS }) {
      fs.mkdirSync(`files/publicaciones/${id}`, { recursive: true })

      fs.renameSync(bundleAndroid.path, `files/publicaciones/${id}/${id}_android`)
      fs.renameSync(bundleIOS.path, `files/publicaciones/${id}/${id}_ios`)

      if (imagenes) {
        $imagenes.insertMany(imagenes, { fkPublicacion: id })
      }

      await ftp.uploadDir(`files/publicaciones/${id}`, `/home/ftp_ar4ecom/ar4ecom.com/Dev/publicaciones/${id}`)

    },
    async afterUpdate({ id }, { imagenesGuardadas, imagenes, bundleAndroid, bundleIOS }) {
      if (imagenesGuardadas) {
        const imagenes = imagenesGuardadas.map((image) => image.split('/').pop())
        images.removeNotIn(`publicaciones/${id}/imagenes`, imagenes)
      }

      // if images are set on the request, save them

      if (imagenes) {
        images.insertMany(`publicaciones/${id}/imagenes`, imagenes)
      }

      // if a bundleAndroid file is set on the request, override the previous one

      if (bundleAndroid) {
        fs.renameSync(bundleAndroid.path, `files/publicaciones/${id}/${id}_android`)
      }

      // if a bundleIOS file is set on the request, override the previous one

      if (bundleIOS) {
        fs.renameSync(bundleIOS.path, `files/publicaciones/${id}/${id}_ios`)
      }

      const exists = await ftp.exists(`/home/ftp_ar4ecom/ar4ecom.com/Dev/publicaciones/${id}`)
      if (exists) {
        await ftp.rmdir(`/home/ftp_ar4ecom/ar4ecom.com/Dev/publicaciones/${id}`, true)
      }
      if (fs.existsSync(`files/publicaciones/${id}`)) {
        await ftp.uploadDir(`files/publicaciones/${id}`, `/home/ftp_ar4ecom/ar4ecom.com/Dev/publicaciones/${id}`)
      }

    },
    async afterRemove({ id }) {
      // Remove files

      const path = `files/publicaciones/${id}`

      if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true })
      }

      // Remove from ftp
      const exists = await ftp.exists(`/home/ftp_ar4ecom/ar4ecom.com/Dev/publicaciones/${id}`)
      if (exists) {
        await ftp.rmdir(`/home/ftp_ar4ecom/ar4ecom.com/Dev/publicaciones/${id}`, true)
      }
    },
  },
})

export default usePublicaciones
