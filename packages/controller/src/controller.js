
export default ({ useTable, useSchema, useFormatter }) => ({ table, schema, format, hooks = {} }) => {

  const $table = useTable(table)
  const $schema = useSchema(schema)
  const $format = useFormatter(format)

  return Object.create({

    async findMany(query, options) {
      let items

      items = await $table.findMany(query, options)
      items = await $format.fillMany(items)

      return items
    },

    async findOne(query, options) {
      let item

      item = await $table.findOne(query, options)

      if (!item) {
        throw new Error('No pudimos encontrar el elemento que estabas buscando')
      }

      item = await $format.fillOne(item)

      return item
    },

    async insertOne(item) {
      $schema.validateOne(item)

      const clean = await $format.cleanOne(item)

      if (hooks.beforeInsert) {
        await hooks.beforeInsert({ ...item })
      }

      const id = await $table.insertOne(clean)

      if (hooks.afterInsert) {
        await hooks.afterInsert({ ...item, id })
      }

      return id
    },

    async updateOne(query, update) {
      // let item

      // item = await this.findOne(query)
      // item = { ...item, ...update }

      $schema.validateOne(update)

      const clean = await $format.cleanOne(update)

      const updated = await $table.updateOne(query, clean)

      if (hooks.afterUpdate) {
        await hooks.afterUpdate(query, { ...update })
      }

      return updated
    },

    async removeOne(query) {
      const result = await $table.removeOne(query)

      if (hooks.afterRemove) {
        await hooks.afterRemove(query)
      }

      return result
    },

  })
}
