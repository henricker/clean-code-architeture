import { SurveyResultModel } from '@/domain/models/survey-result'

export type SaveSurveyResultParams = {
  accountId: string
  surveyId: string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save(data: SaveSurveyResultParams): Promise<SurveyResultModel>
}