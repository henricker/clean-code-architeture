import { AuthMiddleware } from '../../../presentation/middlewares'
import { Middleware } from '../../../presentation/protocols'
import { makeLoadAccountByToken } from '../usecases/load-account-by-token/load-account-by-token-factory'


export const makeAuthMiddleware = (role?: string): Middleware => {
  const authMiddleware = new AuthMiddleware(makeLoadAccountByToken(), role)
  return authMiddleware
}