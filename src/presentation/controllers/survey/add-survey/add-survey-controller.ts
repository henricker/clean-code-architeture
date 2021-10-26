import { HttpRequest, HttpResponse } from "../../../protocols";
import { Validation } from "../../../protocols/validation";
import { Controller } from "./add-survey-controller-protocols";


export class AddSurveyController implements Controller {
  
  constructor(
    private validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest)
    return null
  }
}