
export const useImagenes = ({ images, fs }) => ({

  findMany({ fkPublicacion }) {
    return images.findMany(`publicaciones/${fkPublicacion}/imagenes`)
  },

  insertMany(imagenes, { fkPublicacion }) {
    images.insertMany(`publicaciones/${fkPublicacion}/imagenes`, imagenes)
  },

})
