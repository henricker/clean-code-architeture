import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { 
  Controller, 
  HttpRequest, 
  HttpResponse, 
  SaveSurveyResult,
  LoadSurveyById 
} from './save-survey-result-controller-protocols'


export class SaveSurveyResultController implements Controller {

  constructor(
    private readonly saveSurveyResult: SaveSurveyResult,
    private readonly loadSurveyById: LoadSurveyById 
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { accountId } = httpRequest
      const { answer } = httpRequest.body

      const survey = await this.loadSurveyById.loadById(surveyId)
    
      if(!survey)
        return forbidden(new InvalidParamError('surveyId'))
  
      const answers = survey.answers.map(a => a.answer)
      
      if(!answers.includes(answer))
        return forbidden(new InvalidParamError('answer'))

      await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date()
      })
      
      return null
    } catch(err) {
      return serverError(err)
    }

  }
}