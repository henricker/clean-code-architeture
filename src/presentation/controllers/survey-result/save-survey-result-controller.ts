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
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    
      if(!survey)
        return forbidden(new InvalidParamError('surveyId'))
  
      return null
    } catch(err) {
      return serverError(err)
    }

  }
}