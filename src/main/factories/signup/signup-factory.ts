import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { BcryptAdapter } from '../../../infra/cripthography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-decorator'
import { makeSignUpValidation } from './signup-validation-factory'
import { DbAuthentication } from '../../../data/usecases/db-authentication/db-authentication'
import { JwtAdapter } from '../../../infra/cripthography/jwt-adapter/jwt-adapter'
import env from '../../config/env'

export const makeSignUpController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter(12)
  const jwtAdapter = new JwtAdapter(env.secret)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccountUseCase = new DbAddAccount(bcryptAdapter, addAccountRepository)
  const dbAuthentication = new DbAuthentication(addAccountRepository, bcryptAdapter, jwtAdapter, addAccountRepository)
  const signUpController = new SignUpController(dbAddAccountUseCase, makeSignUpValidation(), dbAuthentication)
  const logMongoRepository = new LogMongoRepository()
  const logControllerDecorator = new LogControllerDecorator(signUpController, logMongoRepository)
  return logControllerDecorator
}