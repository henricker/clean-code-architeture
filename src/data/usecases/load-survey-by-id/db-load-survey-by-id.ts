import { SurveyResultModel, LoadSurveyById, LoadSuveyByIdRepository } from './db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {

  constructor(
    private readonly loadSurveyByIdRepository: LoadSuveyByIdRepository
  ) {}

  async loadById(id: string): Promise<SurveyResultModel> {
    await this.loadSurveyByIdRepository.loadById(id)
    return null
  }
}