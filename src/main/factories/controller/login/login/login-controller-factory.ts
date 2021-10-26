import { Controller } from '../../../../../presentation/protocols/controller'
import { LoginController } from '../../../../../presentation/controllers/login/login/login-controller'
import { makeLoginValidation } from './login-validator-factory'
import { makeAuthentication } from '../../../usecases/authentication/db-authentication-factory'
import { makeLogDecorator } from '../../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeLoginValidation(), makeAuthentication())
  return makeLogDecorator(controller)
}