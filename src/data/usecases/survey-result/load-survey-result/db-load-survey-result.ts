import { LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result-repository";
import { LoadSurveyResult } from "@/domain/usecases/survey-result/load-survey-result";
import { SurveyResultModel } from "../save-survey-result/db-save-survey-result-protocols";


export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.load(surveyId)
    return surveyResult
  }
}