import { auth } from '../middlewares/auth'
import { authAdmin } from '../middlewares/auth-admin'
import { adaptRouter } from '@/main/adapters/express/express-router-adapter'
import { makeAddSurveyController } from '@/main/factories/controller/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '@/main/factories/controller/survey/load-survey/load-survey-controller.factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', authAdmin, adaptRouter(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRouter(makeLoadSurveysController()))
}
