import { EmailInUseError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Validation } from '@/presentation/protocols/validation'
import { 
  HttpRequest, 
  HttpResponse, 
  Controller, 
  AddAccount,  
  Authentication
} from './signup-controller-protocols'

export class SignUpController implements Controller {

  constructor(
    private readonly addAccount: AddAccount, 
    private readonly validation: Validation,
    private readonly authentication: Authentication  
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      
      if(error)
        return badRequest(error)
      
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({ email, name, password  })

      if(!account) 
        return forbidden(new EmailInUseError())

      const accessToken = await this.authentication.auth({ email, password })

      return ok({ accessToken })
    } catch(error) {
      console.error(error)
      return serverError(error)
    }
  }
}