import env from '../../config/env'
import { Controller } from '../../../presentation/protocols/controller'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { makeLoginValidation } from './login-validator-factory'
import { DbAuthentication } from '../../../data/usecases/db-authentication/db-authentication'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { BcryptAdapter } from '../../../infra/cripthography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cripthography/jwt-adapter/jwt-adapter'

export const makeLoginController = (): Controller => {
  const hasherCompare = new BcryptAdapter(12)
  const jwtAdapter = new JwtAdapter(env.secret)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, hasherCompare, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(makeLoginValidation(), dbAuthentication)
  return loginController
}