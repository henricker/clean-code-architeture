import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express/express-middleware-adapter'
import { adaptRouter } from '../adapters/express/express-router-adapter'
import { makeAddSurveyController } from '../factories/controller/survey/add-survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '../factories/middleware/auth-middleware-factory'

export default (router: Router): void => {
  const authAdminMiddleware = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', authAdminMiddleware, adaptRouter(makeAddSurveyController()))
}
