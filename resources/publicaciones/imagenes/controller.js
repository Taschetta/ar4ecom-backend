
export const useImagenes = ({ images, fs }) => ({

  findMany({ fkPublicacion }) {
    return images.findMany(`publicaciones/${fkPublicacion}/imagenes`)
  },

  insertMany(imagenes, { fkPublicacion }) {
    fs.mkdirSync(`files/publicaciones/${fkPublicacion}`)

    if (imagenes) {
      images.insertMany(`publicaciones/${fkPublicacion}/imagenes`, imagenes)
    }
  },

})
