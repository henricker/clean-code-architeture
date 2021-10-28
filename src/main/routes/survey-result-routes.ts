
import { Router } from 'express'
import { adaptRouter } from '../adapters/express/express-router-adapter'
import { makeSaveSurveyResultController } from '../factories/controller/survey-result/save-survey-result/save-survey-result-controller-factory'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRouter(makeSaveSurveyResultController()))
}