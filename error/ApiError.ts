class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly message: string
  ) {
    super()
  }

  static badRequest(message: string) {
    throw new ApiError(404, message)
  }

  static notAuth(message: string) {
    throw new ApiError(401, message)
  }

  static internal(message: string) {
    throw new ApiError(500, message)
  }

  static forbidden(message: string) {
    throw new ApiError(403, message)
  }
}

export default ApiError
