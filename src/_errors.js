
export class BadRequestError extends Error {
  constructor(message) {
    super(`Los datos provistos son invalidos: ${message}`)
    this.name = 'BadRequestError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequestError)
    }
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(`No se pudo autenticar tu pedido: ${message}`)
    this.name = 'UnauthorizedError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedError)
    }
  }
}
