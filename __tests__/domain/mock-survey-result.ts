import { SurveyResultModel } from '../../src/domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '../../src/domain/usecases/save-survey-result'

import faker from 'faker'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: faker.datatype.uuid(),
  surveyId: faker.datatype.uuid(),
  answer: faker.random.word(),
  date: faker.date.recent()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  answer: faker.random.words(),
  date: faker.date.recent(),
  id: faker.datatype.uuid()
})