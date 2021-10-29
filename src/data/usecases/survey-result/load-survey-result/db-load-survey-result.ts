import { LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result-repository";
import { LoadSurveyResult } from "@/domain/usecases/survey-result/load-survey-result";
import { LoadSurveyByIdRepository } from "../../survey/load-survey-by-id/db-load-survey-by-id-protocols";
import { SurveyResultModel } from "../save-survey-result/db-save-survey-result-protocols";


export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)

    if(!surveyResult) {
      await this.loadSurveyByIdRepository.loadById(surveyId)
    }

    return surveyResult
  }
}