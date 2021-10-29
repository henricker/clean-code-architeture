import { AddSurvey, AddSurveyParams, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor(
    private addSurveyRepository: AddSurveyRepository
  ) {}

  async add(data: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
  
}