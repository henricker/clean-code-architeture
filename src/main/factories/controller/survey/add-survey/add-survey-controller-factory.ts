import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAddSurvey } from '@/main/factories/usecases/add-survey/db-add-survey-factory'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogDecorator(addSurveyController)
}