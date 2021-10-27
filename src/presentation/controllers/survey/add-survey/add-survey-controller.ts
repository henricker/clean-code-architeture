import { AddSurvey, Controller } from './add-survey-controller-protocols'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Validation } from '@/presentation/protocols/validation'


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