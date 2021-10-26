import { badRequest, noContent, serverError } from "../../../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../../../protocols";
import { Validation } from "../../../protocols/validation";
import { AddSurvey, Controller } from "./add-survey-controller-protocols";


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
  
      await this.addSurvey.add(httpRequest.body)
      
      return noContent()
    } catch(err) {
      return serverError(err)
    }

  }
}