class CustomError extends Error {
  constructor (params) {
    super(params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }

    this.name = 'CustomError'
    this.message = 'Unprocessable Input'
  }
}

class AuthenticationError extends CustomError {
  constructor (params) {
    super(params)

    this.name = 'AuthenticationError'
    this.message = 'Invalid username/password'
  }
}

export { AuthenticationError }
