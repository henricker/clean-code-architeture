import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error';

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', () => {
    // sut => system under test
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'joeDoe@mail.com',
        password: 'joe@Password',
        passwordConfirmation: 'joe@Password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  
  it('should return 400 if no email is provided', () => {
    // sut => system under test
    const sut = new SignUpController()
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
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: "Joe Doe",
        email: 'joeDoe@mail.com',
        passwordConfirmation: 'joe@Password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  it('should return 400 if no passwordConfirmation is provided', () => {
    // sut => system under test
    const sut = new SignUpController()
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
})