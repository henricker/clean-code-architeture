import { SignUpController } from './signup'

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
  })
})