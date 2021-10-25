import { SignUpController } from './signup-controller'
import { 
  AccountModel,
  AddAccount, 
  AddAccountModel,
  HttpRequest, 
  } from './signup-controller-protocols'
import { ServerError } from '../../errors/server-error'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'

interface SutTypes {
  sut: SignUpController
  validationStub: Validation
  addAccountStub: AddAccount
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password',
    passwordConfirmation: 'valid_password'
  }
})

const makeFakeAccountModel = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccountModel()))
    }
  }

  return new AddAccountStub()
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
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    validationStub,
    addAccountStub
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
    expect(addSpy).toHaveBeenCalledWith({
      email: "valid_email@email.com",
      name: "valid_name",
      password: "valid_password"
    })
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

  it('should return 200 if valid data is provided', async () => {
    // sut => system under test
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccountModel()))
  })
})