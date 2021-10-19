import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { 
  HttpRequest, 
  HttpResponse, 
  Controller, 
  EmailValidator, 
  AddAccount  
} from './signup-protocols'

export class SignUpController implements Controller {

  constructor(private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for(const field of requiredFields)
        if(!httpRequest.body[field])
          return badRequest(new MissingParamError(field))
    
      const { name, email, password, passwordConfirmation } = httpRequest.body

      if(password !== passwordConfirmation)
        return badRequest(new InvalidParamError('passwordConfirmation'))
      
      const emailIsValid = this.emailValidator.isValid(email)
      
      if(!emailIsValid)
        return badRequest(new InvalidParamError('email'))

      const account = await this.addAccount.add({ email, name, password  })
      
      return ok(account)
    } catch(error) {
      console.error(error)
      return serverError()
    }
  }
}