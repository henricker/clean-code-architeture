import { SaveSurveyResultRepository, SaveSurveyResultModel, SurveyResultModel } from './db-save-survey-result-protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSurveyResultModel = (): SurveyResultModel => ({
  id:'valid_id',
  accountId: 'valid_account_id',
  answer: 'valid_answer',
  date: new Date('2021-10-27T16:16:47.696Z'),
  surveyId: 'valid_survey_id'
})

const makeSaveSurveyResultModel = (): SaveSurveyResultModel => ({
  accountId: 'valid_account_id',
  answer: 'valid_answer',
  date: new Date('2021-10-27T16:16:47.696Z'),
  surveyId: 'valid_survey_id'
})


const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return makeSurveyResultModel()
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  
  it('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(makeSaveSurveyResultModel())
    expect(saveSpy).toHaveBeenCalledWith(makeSaveSurveyResultModel())
  })

  it('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const promise = sut.save(makeSaveSurveyResultModel())
    await expect(promise).rejects.toThrow()
  })

})