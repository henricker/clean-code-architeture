import { LoadAccountByToken, HttpRequest, HttpResponse, Middleware } from './auth-middleware-protocols'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {

  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']

      if(!accessToken)
        return forbidden(new AccessDeniedError())
  
      const account = await this.loadAccountByToken.load(accessToken, this.role)
   
      if(!account)
        return forbidden(new AccessDeniedError())

      return ok({ accountId: account.id })
    } catch(err) {
      return serverError(err)
    }
  }
}