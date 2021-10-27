import { Router } from 'express'
import { adaptRouter } from '../adapters/express/express-router-adapter'
import { makeAddSurveyController } from '../factories/controller/survey/add-survey/add-survey-controller-factory'
import { authAdmin } from '../middlewares/auth-admin'

export default (router: Router): void => {
  router.post('/surveys', authAdmin, adaptRouter(makeAddSurveyController()))
}
