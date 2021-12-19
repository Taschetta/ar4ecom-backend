
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
      item = await $format.fillOne(item)

      return item
    },

    async insertOne(item) {
      $schema.validateOne(item)

      const clean = await $format.cleanOne(item)
      const id = await $table.insertOne(clean)

      if (hooks.afterInsert) {
        hooks.afterInsert({ ...item, id })
      }

      return id
    },

    async updateOne(query, update) {
      let item

      item = await this.findOne(query)
      item = { ...item, ...update }

      $schema.validateOne(item)

      const clean = await $format.cleanOne(item)

      const updated = $table.updateOne({ id: item.id }, clean)

      if (hooks.afterUpdate) {
        hooks.afterUpdate({ ...item })
      }

      return updated
    },

    async removeOne(query) {
      const result = await $table.removeOne(query)

      if (hooks.afterRemove) {
        hooks.afterRemove(query)
      }

      return result
    },

  })
}
