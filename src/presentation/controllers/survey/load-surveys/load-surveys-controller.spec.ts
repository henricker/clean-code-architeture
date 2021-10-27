import { SurveyModel } from '../../../../domain/models/Survey'
import { LoadSurveyController } from './load-surveys-controller'
import { HttpRequest, LoadSurveys } from './load-surveys-controller-protocols'

interface ISutTypes {
  sut: LoadSurveyController
  loadSurveysStub: LoadSurveys
}

const makeSurveysModels = (): SurveyModel[] => ([
  {
    id: 'valid_id',
    answers: [
      {
        answer: 'answer_1',
      },
      {
        answer: 'answer_2',
        image: 'image_url',
      },
    ],
    date: new Date('2021-10-27T16:16:47.696Z'),
    question: 'valid_question'
  }
])

const makeFakeRequest = (): HttpRequest => ({})

const makeLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return makeSurveysModels()
    }
  }

  return new LoadSurveysStub()
}

const makeSut = (): ISutTypes => {
  const loadSurveysStub = makeLoadSurveysStub()
  const sut = new LoadSurveyController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  it('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalled()
  })
})