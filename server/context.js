import authenticate from './authenticate'

const context = async ({ req }) => {
  const token = req.cookies['jwt'] || ''
  const user = await authenticate(token)

  return {
    user,
  }
}

export default context
