import { SignUpController } from './signup'
import { 
  EmailValidator, 
  AccountModel,
  AddAccount, 
  AddAccountModel,
  HttpRequest, 
  } from './signup-protocols'
import { ServerError } from '../../errors/server-error'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
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

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  //stub => simple return
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  const addAccountStub = makeAddAccount()
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', async () => {
    // sut => system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'joeDoe@mail.com',
        password: 'joe@Password',
        passwordConfirmation: 'joe@Password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })
  
  it('should return 400 if no email is provided', async () => {
    // sut => system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "Joe Doe",
        password: 'joe@Password',
        passwordConfirmation: 'joe@Password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  
  it('should return 400 if no password is provided', async () => {
    // sut => system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "Joe Doe",
        email: 'joeDoe@mail.com',
        passwordConfirmation: 'joe@Password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
  
  it('should return 400 if no passwordConfirmation is provided', async () => {
    // sut => system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "Joe Doe",
        email: 'joeDoe@mail.com',
        password: 'joe@Password',
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })
  
  it("should return 400 if no passwordConfirmation does't not match with password", async () => {
    // sut => system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "Joe Doe",
        email: 'joeDoe@mail.com',
        password: 'joe@Password',
        passwordConfirmation: 'Password@joe'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })
  
  it('should return 400 if an invalid email is provided', async () => {
    // sut => system under test
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
  
    const httpRequest = {
      body: {
        name: "Joe Doe",
        email: 'invalid_mail.com',
        password: 'joe@Password',
        passwordConfirmation: 'joe@Password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
  
  it('should call EmailValidator with correct email', async () => {
    // sut => system under test
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('valid_email@email.com')
  })
  
  it('should return 500 if email validator throws', async () => {
    // sut => system under test
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error('any error on EmailValidator')
    })
    
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
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