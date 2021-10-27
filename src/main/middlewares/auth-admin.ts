import { adaptMiddleware } from '../adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middleware/auth-middleware-factory'

export const authAdmin = adaptMiddleware(makeAuthMiddleware('admin'))