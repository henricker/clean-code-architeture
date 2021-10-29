import { SurveyModel } from '../load-surveys/db-load-surveys-protocols'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSuveyByIdRepository } from './db-load-survey-by-id-protocols'
import { mockSurveyModel } from '@/__tests__/domain/mock-survey'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSuveyByIdRepository
}

const makeFakeSurveyModel = mockSurveyModel()


const makeLoadSurveyByIdRepositoryStub = (): LoadSuveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSuveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return makeFakeSurveyModel
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadAccountById UseCase', () => {
  
  it('Should call LoadSurveybyIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('valid_id')
    expect(loadSpy).toHaveBeenCalledWith('valid_id')
  })

  it('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
    const promise = sut.loadById('valid_id')
    await expect(promise).rejects.toThrow()
  })

  it('Should return a Survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('valid_id')
    expect(survey).toEqual(makeFakeSurveyModel)
  })

})