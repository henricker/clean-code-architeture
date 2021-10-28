import { DbLoadSurveyById } from '@/data/usecases/survey-result/load-survey-by-id/db-load-survey-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyById = (): DbLoadSurveyById => {
  const loadSurveyByIdRepository = new SurveyMongoRepository()
  const dbLoadSurveyById = new DbLoadSurveyById(loadSurveyByIdRepository)
  return dbLoadSurveyById
} 