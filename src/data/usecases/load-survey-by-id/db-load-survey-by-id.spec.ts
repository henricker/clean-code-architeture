import { SurveyModel } from '../load-surveys/db-load-surveys-protocols'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSuveyByIdRepository } from './db-load-survey-by-id-protocols'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSuveyByIdRepository
}

const makeSurveysModel = (): SurveyModel => (
  {
    id: 'valid_id',
    answers: [
      {
        answer: 'answer_1',
      },
    ],
    date: new Date('2021-10-27T16:16:47.696Z'),
    question: 'valid_question'
  }
)


const makeLoadSurveyByIdRepositoryStub = (): LoadSuveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSuveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return makeSurveysModel()
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
  it('Should call LoadbyIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('valid_id')
    expect(loadSpy).toHaveBeenCalledWith('valid_id')
  })
})