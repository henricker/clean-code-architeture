import { Controller, HttpRequest, HttpResponse } from './load-survey-controller-protocols'


export class LoadSurveyController implements Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }
}