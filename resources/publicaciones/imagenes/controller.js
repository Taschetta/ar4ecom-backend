
export const useImagenes = ({ images }) => ({

  findMany({ fkPublicacion }) {
    return images.findMany(`publicaciones/${fkPublicacion}/imagenes`)
  },

  insertMany(imagenes, { fkPublicacion }) {
    images.insertMany(`publicaciones/${fkPublicacion}/imagenes`, imagenes)
  },

})
