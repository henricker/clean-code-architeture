import { LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result-repository";
import { mockSurveyResultModel } from "@/__tests__/domain/mock-survey-result";
import { SurveyResultModel } from "../save-survey-result/db-save-survey-result-protocols";
import { DbLoadSurveyResult } from "./db-load-survey-result";

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSurveyResultModel = mockSurveyResultModel()

const makeLoadSurveyResultRepositoryStub = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async load(surveyId: string): Promise<SurveyResultModel> {
      return makeSurveyResultModel
    }
  }

  return new LoadSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepositoryStub()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}


describe('DbLoadSurveyResult UseCase', () => {

  it('Should call LoadSurveyRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'load')
    await sut.load(makeSurveyResultModel.surveyId)
    expect(loadSpy).toHaveBeenCalledWith(makeSurveyResultModel.surveyId)
  })

})