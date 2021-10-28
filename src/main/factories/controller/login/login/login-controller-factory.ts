import { makeLoginValidation } from './login-validator-factory'
import { Controller } from '@/presentation/protocols/controller'
import { LoginController } from '@/presentation/controllers/login/login/login-controller'
import { makeAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { makeLogDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeLoginValidation(), makeAuthentication())
  return makeLogDecorator(controller)
}