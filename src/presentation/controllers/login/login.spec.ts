import { HttpRequest, HttpResponse } from "../../protocols"
import { LoginController } from "./login"
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from "../../errors"

interface ISutType {
  sut: LoginController
}

const makeFakeLogin = () => ({
  email: 'any_mail',
  password: 'any_password'
})

const makeSut = (): ISutType => {
  const sut = new LoginController()
  return {
    sut
  }
}

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})