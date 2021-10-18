import { SignUpController } from './signup'
import { 
  EmailValidator, 
  AccountModel,
  AddAccount, 
  AddAccountModel, 
  } from './signup-protocols'
import { ServerError } from '../../errors/server-error'
import { InvalidParamError, MissingParamError } from '../../errors'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }

      return fakeAccount
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
  it('should return 400 if no name is provided', () => {
    // sut => system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'joeDoe@mail.com',
        password: 'joe@Password',
        passwordConfirmation: 'joe@Password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  
  it('should return 400 if no email is provided', () => {
    // sut => system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "Joe Doe",
        password: 'joe@Password',
        passwordConfirmation: 'joe@Password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  
  it('should return 400 if no password is provided', () => {
    // sut => system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "Joe Doe",
        email: 'joeDoe@mail.com',
        passwordConfirmation: 'joe@Password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  
  it('should return 400 if no passwordConfirmation is provided', () => {
    // sut => system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "Joe Doe",
        email: 'joeDoe@mail.com',
        password: 'joe@Password',
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
  
  it('should return 400 if no passwordConfirmation is provided', () => {
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
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  
  it('should return 400 if an invalid email is provided', () => {
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
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  
  it('should call EmailValidator with correct email', () => {
    // sut => system under test
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    
    const httpRequest = {
      body: {
        name: "Joe Doe",
        email: 'joedDoe@email.com',
        password: 'joe@Password',
        passwordConfirmation: 'joe@Password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('joedDoe@email.com')
  })
  
  it('should return 500 if email validator throws', () => {
    // sut => system under test
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error('any error on EmailValidator')
    })
    
    const httpRequest = {
      body: {
        name: "Joe Doe",
        email: 'joedDoe@email.com',
        password: 'joe@Password',
        passwordConfirmation: 'joe@Password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  
  it('should call AddAccount with correct values', () => {
    const { sut, addAccountStub, emailValidatorStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })
  })
  
  it('should return 500 if addAccount throws', () => {
    // sut => system under test
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error('any error on EmailValidator')
    })
    
    const httpRequest = {
      body: {
        name: "Joe Doe",
        email: 'joedDoe@email.com',
        password: 'joe@Password',
        passwordConfirmation: 'joe@Password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})