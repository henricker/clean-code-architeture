import { SurveyModel } from "@/domain/models/Survey"
import { SurveyResultModel } from "@/domain/models/survey-result"
import { SaveSurveyResultModel } from "@/domain/usecases/save-survey-result"
import { InvalidParamError } from "@/presentation/errors"
import { forbidden, serverError } from "@/presentation/helpers/http/http-helper"
import { SaveSurveyResultController } from "./save-survey-result-controller"
import { HttpRequest, LoadSurveyById, SaveSurveyResult } from "./save-survey-result-controller-protocols"
import MockDate from 'mockdate'

type SutTypes = {
  sut: SaveSurveyResultController
  saveSurveyResultStub: SaveSurveyResult
  loadSurveyByIdStub: LoadSurveyById
}

const makeHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  accountId: 'any_account_id',
  body: {
    answer: 'valid_answer'
  }
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_survey_id',
  answers: [
    {
      answer: 'valid_answer',
    },
  ],
  date: new Date('2021-10-27T16:16:47.696Z'),
  question: 'valid_question'
}
)

const makeLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return makeFakeSurvey()
    }
  }

  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      throw new Error("Method not implemented.")
    }
  }

  return new SaveSurveyResultStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = makeSaveSurveyResultStub()
  const loadSurveyByIdStub = makeLoadSurveyByIdStub()
  const sut = new SaveSurveyResultController(saveSurveyResultStub, loadSurveyByIdStub)

  return {
    sut,
    saveSurveyResultStub,
    loadSurveyByIdStub
  }
}

describe('SaveSurveyResult Controller', () => {

  beforeAll(() => {
    MockDate.set(new Date('2021-10-27T16:16:47.696Z'))
  })

  afterAll(() => {
    MockDate.reset()
  })
  
  it('Should call LoadSurveyById with correct id', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSpy  = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  it('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ ...makeHttpRequest(), body: { answer: 'wrong_answer' } })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy  = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeHttpRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      surveyId: 'any_survey_id',
      answer: 'valid_answer',
      date: new Date('2021-10-27T16:16:47.696Z')
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })


})