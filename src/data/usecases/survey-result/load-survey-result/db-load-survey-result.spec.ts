import { mockSurveyResultModel } from "@/__tests__/domain/mock-survey-result"
import { DbLoadSurveyResult } from "./db-load-survey-result"
import { LoadSurveyResultRepository, SurveyResultModel } from "./db-load-survey-result-protocols"


type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSurveyResultModel = mockSurveyResultModel()

const makeLoadSurveyResultRepositoryStub = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
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
    const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load(makeSurveyResultModel.surveyId)
    expect(loadSpy).toHaveBeenCalledWith(makeSurveyResultModel.surveyId)
  })

  it('Should throw if LoadSurveyRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())
    const promise = sut.load(makeSurveyResultModel.surveyId)
    await expect(promise).rejects.toThrow()
  })

  it('Should return SurveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResult =await sut.load(makeSurveyResultModel.surveyId)
    expect(surveyResult).toEqual(makeSurveyResultModel)
  })

})