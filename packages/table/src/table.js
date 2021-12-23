
export default ({ connection, builder: build }) => (table) => ({

  async query(query = {}) {
    try {
      const sql = build(query)
      const result = await connection.query(sql)
      return result[0]
    } catch (error) {
      switch (error.code) {
        case 'ER_ROW_IS_REFERENCED_2':
          throw new DatabaseError('El campo es utilizado por otra tabla, no se puede eliminar.')
        default:
          console.error(error)
          throw new DatabaseError('Se produjo un error al intentar modificar los datos')
      }
    }
  },

  async findMany(query = {}, options = {}) {
    const result = await this.query({
      $select: {
        table,
        only: options.only,
      },
      $where: query,
      $order: {
        by: options.orderBy,
        sort: options.sort,
      },
      $limit: {
        amount: options.limit,
        offset: options.offset,
      },
    })

    return result
  },

  async findOne(query = {}, options = {}) {
    const result = await this.query({
      $select: {
        table,
        only: options.only,
      },
      $where: query,
      $order: {
        by: options.orderBy,
        sort: options.sort,
      },
      $limit: {
        amount: 1,
        offset: options.offset,
      },
    })

    return result[0]
  },

  async insertMany(rows = []) {
    const result = await this.query({
      $insert: { table, values: rows },
    })

    return result.insertId
  },

  async insertOne(row = []) {
    const result = await this.query({
      $insert: { table, value: row },
    })

    return result.insertId
  },

  async updateMany(query, data, options = {}) {
    const result = await this.query({
      $update: {
        table,
        set: data,
      },
      $where: query,
      $order: {
        by: options.orderBy,
        sort: options.sort,
      },
      $limit: {
        amount: options.limit,
        offset: options.offset,
      },
    })

    return result.affectedRows
  },

  async updateOne(query, data, options = {}) {
    const result = await this.query({
      $update: { table, set: data },
      $where: query,
      $order: {
        by: options.orderBy,
        sort: options.sort,
      },
      $limit: {
        amount: 1,
        offset: options.offset,
      },
    })

    return !!result.affectedRows
  },

  async upsertOne({ id, ...data }, options = {}) {
    if (id) {
      const wasChanged = await this.updateOne({ id }, data, options)
      if (wasChanged) {
        return id
      }
    }
    return this.insertOne(data, options)
  },

  async removeMany(query = {}, options = {}) {
    const result = await this.query({
      $delete: { table },
      $where: query,
      $order: {
        by: options.orderBy,
        sort: options.sort,
      },
      $limit: {
        amount: options.limit,
        offset: options.offset,
      },
    })

    return result.affectedRows
  },

  async removeOne(query = {}, options = {}) {
    const result = await this.query({
      $delete: { table },
      $where: query,
      $order: {
        by: options.orderBy,
        sort: options.sort,
      },
      $limit: {
        amount: 1,
        offset: options.offset,
      },
    })

    return !!result.affectedRows
  },

})

class DatabaseError extends Error {
  constructor(message) {
    super(message)
    this.name = 'DatabaseError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError)
    }
  }
}
