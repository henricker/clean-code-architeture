import { Router } from 'express'
import { adaptRouter } from '../adapters/express-router-adapter'
import { makeSignUpController } from '../factories/signup'

export default (router: Router): void => {
  router.post('/signup', adaptRouter(makeSignUpController()))
}