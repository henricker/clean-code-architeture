import { badRequest } from "../../../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../../../protocols";
import { Validation } from "../../../protocols/validation";
import { Controller } from "./add-survey-controller-protocols";


export class AddSurveyController implements Controller {
  
  constructor(
    private validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest)
    if(error)
      return badRequest(error)
    return null
  }
}