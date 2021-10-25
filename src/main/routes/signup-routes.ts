import { Router } from 'express'
import { adaptRouter } from '../adapters/express/express-router-adapter'
import { makeSignUpController } from '../factories/signup/signup'

export default (router: Router): void => {
  router.post('/signup', adaptRouter(makeSignUpController()))
}