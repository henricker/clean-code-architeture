import { adaptRouter } from '@/main/adapters/express/express-router-adapter'
import { makeLoginController } from '@/main/factories/controller/login/login/login-controller-factory'
import { makeSignUpController } from '@/main/factories/controller/login/signup/signup-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adaptRouter(makeSignUpController()))
  router.post('/login', adaptRouter(makeLoginController()))
}