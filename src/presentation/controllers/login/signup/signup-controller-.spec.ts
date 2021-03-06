import { SignUpController } from './signup-controller'
import { 
  AccountModel,
  AddAccount, 
  AddAccountParams,
  HttpRequest, 
  Authentication,
  AuthenticationParams
  } from './signup-controller-protocols'
import { ServerError } from '@/presentation/errors/server-error'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Validation } from '@/presentation/protocols/validation'
import { EmailInUseError } from '@/presentation/errors'
import { mockAddAccountParams } from '@/__tests__/domain/mock-account'

const makeFakeAccountParams = mockAddAccountParams()

type SutTypes = {
  sut: SignUpController
  validationStub: Validation
  addAccountStub: AddAccount
  authenticationStub: Authentication
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    ...makeFakeAccountParams,
    passwordConfirmation: makeFakeAccountParams.password
  }
})

const makeFakeAccountModel = (): AccountModel => ({
  id: 'valid_id',
  ...makeFakeAccountParams,
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountParams): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccountModel()))
    }
  }

  return new AddAccountStub()
}


const makeAuthenticatioStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationParams): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub()
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    public error: Error = null
    public input: any 

    validate(input: any): Error {
      this.input = input
      return this.error
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidationStub()
  const authenticationStub = makeAuthenticatioStub()
  const sut = new SignUpController(
    addAccountStub, 
    validationStub, 
    authenticationStub
  )
  return {
    sut,
    validationStub,
    addAccountStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  it('should call Validation with correct value', async () => {
    const { sut, validationStub  } = makeSut()
    const request = makeFakeRequest()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub  } = makeSut()
    const request = makeFakeRequest()
    validationStub['error'] = new Error('error')
    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(badRequest(new Error('error')))
  })

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeAccountParams)
  })
  
  it('should return 500 if addAccount throws', async () => {
    // sut => system under test
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  it('should return 403 if email already in use', async () => {
    // sut => system under test
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  it('should return 200 if valid data is provided', async () => {
    // sut => system under test
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())

    expect(authSpy).toHaveBeenCalledWith({ email: makeFakeAccountParams.email, password: makeFakeAccountParams.password })
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())
    const promise = await sut.handle(makeFakeRequest())
    expect(promise).toEqual(serverError(new Error()))
  })
})