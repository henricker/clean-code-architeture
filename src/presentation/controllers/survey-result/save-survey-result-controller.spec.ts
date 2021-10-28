import { SurveyModel } from "@/domain/models/Survey"
import { SurveyResultModel } from "@/domain/models/survey-result"
import { SaveSurveyResultModel } from "@/domain/usecases/save-survey-result"
import { InvalidParamError } from "@/presentation/errors"
import { forbidden } from "@/presentation/helpers/http/http-helper"
import { SaveSurveyResultController } from "./save-survey-result-controller"
import { HttpRequest, LoadSurveyById, SaveSurveyResult } from "./save-survey-result-controller-protocols"

type SutTypes = {
  sut: SaveSurveyResultController
  saveSurveyResultStub: SaveSurveyResult
  loadSurveyByIdStub: LoadSurveyById
}

const makeHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_survey_id',
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

})