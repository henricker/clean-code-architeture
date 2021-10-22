import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, ok, serverError, unauthorized } from "../../helpers/http-helper"
import { LoginController } from "./login"
import { 
  Authentication, 
  Controller, 
  EmailValidator, 
  HttpRequest, 
  HttpResponse 
} from "./login-protocols"


interface ISutType {
  sut: LoginController,
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})

const makeSut = (): ISutType => {
  const authenticationStub = makeAuthentication()
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
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

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())

    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())

    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const error = new Error()
    error.stack = 'any_error'

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email) => {
      throw error
    })
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(error))
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())

    expect(authSpy).toHaveBeenCalledWith('any_email@email.com', 'any_password')
  })

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const error = new Error()
    error.stack = 'any_error'

    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(error))
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})