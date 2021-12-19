
export default ({ clean, fill } = {}) => ({

  async cleanOne(item = {}) {
    if (clean) {
      item = await clean({ ...item })
    }
    return item
  },

  async cleanMany(items = []) {
    if (clean) {
      items = await items.map((item) => clean({ ...item }))
      items = await Promise.all(items)
    }
    return items
  },

  async fillOne(item = {}) {
    if (fill) {
      item = await fill({ ...item })
    }
    return item
  },

  async fillMany(items = []) {
    if (fill) {
      items = await items.map((item) => fill({ ...item }))
      items = await Promise.all(items)
    }
    return items
  },

})
