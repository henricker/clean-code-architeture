import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../../../protocols'
import { Validation } from '../../../protocols/validation'
import { AddSurvey, Controller } from './add-survey-controller-protocols'


export class AddSurveyController implements Controller {
  
  constructor(
    private validation: Validation,
    private addSurvey: AddSurvey
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      
      if(error)
        return badRequest(error)

      const { question, answers } = httpRequest.body
  
      await this.addSurvey.add({
        answers,
        question,
        date: new Date()
      })
      
      return noContent()
    } catch(err) {
      return serverError(err)
    }

  }
}