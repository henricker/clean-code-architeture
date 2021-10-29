import { SaveSurveyResultRepository, SaveSurveyResultParams, LoadSurveyResultRepository, SurveyResultModel } from './db-save-survey-result-protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/__tests__/domain/mock-survey-result'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSaveSurveyResultParams = mockSaveSurveyResultParams()
const makeSurveyResultModel = { ...mockSurveyResultModel(), surveyId: makeSaveSurveyResultParams.surveyId }

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultParams): Promise<void> {}
  }

  return new SaveSurveyResultRepositoryStub()
}

const makeLoadSurveyResultRepositoryStub = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
      return makeSurveyResultModel
    }
  }

  return new LoadSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub()
  const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  
  it('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(makeSaveSurveyResultParams)
    expect(saveSpy).toHaveBeenCalledWith(makeSaveSurveyResultParams)
  })

  it('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const promise = sut.save(makeSaveSurveyResultParams)
    await expect(promise).rejects.toThrow()
  })

  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.save(makeSaveSurveyResultParams)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(makeSurveyResultModel.surveyId)
  })
  
  it('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())
    const promise = sut.save(makeSaveSurveyResultParams)
    await expect(promise).rejects.toThrow()
  })

  it('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(makeSaveSurveyResultParams)
    expect(surveyResult).toEqual(makeSurveyResultModel)
  })

})