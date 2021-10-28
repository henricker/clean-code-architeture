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
    await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    return null
  }
}