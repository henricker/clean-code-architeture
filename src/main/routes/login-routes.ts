import { Router } from 'express'
import { adaptRouter } from '../adapters/express/express-router-adapter'
import { makeLoginController } from '../factories/controller/login/login/login-controller-factory'
import { makeSignUpController } from '../factories/controller/login/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRouter(makeSignUpController()))
  router.post('/login', adaptRouter(makeLoginController()))
}