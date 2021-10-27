import { Router } from 'express'
import { adaptRouter } from '../adapters/express/express-router-adapter'
import { makeAddSurveyController } from '../factories/controller/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controller/survey/load-survey/load-survey-controller.factory'
import { auth } from '../middlewares/auth'
import { authAdmin } from '../middlewares/auth-admin'

export default (router: Router): void => {
  router.post('/surveys', authAdmin, adaptRouter(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRouter(makeLoadSurveysController()))
}
