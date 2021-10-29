import { mockSurveyModel } from "@/__tests__/domain/mock-survey"
import { mockSurveyResultModel } from "@/__tests__/domain/mock-survey-result"
import { DbLoadSurveyResult } from "./db-load-survey-result"
import { LoadSurveyResultRepository, SurveyResultModel, LoadSurveyByIdRepository, SurveyModel } from "./db-load-survey-result-protocols"


type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSurveyModel = mockSurveyModel()
const makeSurveyResultModel = { ...mockSurveyResultModel(), surveyId: makeSurveyModel.id }

const makeLoadSurveyResultRepositoryStub = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
      return makeSurveyResultModel
    }
  }

  return new LoadSurveyResultRepositoryStub()
}

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return makeSurveyModel
    }
  }

  return new LoadSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepositoryStub()
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}


describe('DbLoadSurveyResult UseCase', () => {

  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load(makeSurveyResultModel.surveyId)
    expect(loadSpy).toHaveBeenCalledWith(makeSurveyResultModel.surveyId)
  })

  it('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())
    const promise = sut.load(makeSurveyResultModel.surveyId)
    await expect(promise).rejects.toThrow()
  })

  it('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.load(makeSurveyResultModel.surveyId)
    expect(loadByIdSpy).toHaveBeenCalledWith(makeSurveyResultModel.surveyId)
  })

  it('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = sut.load(makeSurveyResultModel.surveyId)
    expect(promise).rejects.toThrow()
  })

  it('Should return SurveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResult =await sut.load(makeSurveyResultModel.surveyId)
    expect(surveyResult).toEqual(makeSurveyResultModel)
  })

})