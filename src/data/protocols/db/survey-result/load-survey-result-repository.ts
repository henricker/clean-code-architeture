import { SurveyResultModel } from "@/domain/models/survey-result";

export interface LoadSurveyResultRepository {
  load(surveyId: string): Promise<SurveyResultModel>
}