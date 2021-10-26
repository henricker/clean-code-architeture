import { Router } from 'express'
import { adaptRouter } from '../adapters/express/express-router-adapter'
import { makeAddSurveyController } from '../factories/controller/survey/add-survey/add-survey-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', adaptRouter(makeAddSurveyController()))
}
