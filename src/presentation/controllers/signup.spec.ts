import { SignUpController } from './signup'
import { EmailValidator } from '../protocols'
import { ServerError } from '../errors/server-error'
import { InvalidParamError, MissingParamError } from '../errors'

interface SutTypes {
  sut: SignUpController,
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

const makeSut = (): SutTypes => {
  //stub => simple return
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', () => {
    // sut => system under test
    const { sut } = makeSut();
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
    expect(httpResponse.statusCode).toBe(400);
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
    expect(httpResponse.statusCode).toBe(400);
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
    expect(httpResponse.statusCode).toBe(400);
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
    expect(httpResponse.statusCode).toBe(400);
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
})