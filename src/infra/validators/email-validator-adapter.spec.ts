import EmailValidatorAdapter from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail: (): boolean => true
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  it('should returns false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email.com')
    expect(isValid).toBe(false)
  })

  it('should returns true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid@email.com')
    expect(isValid).toBe(true)
  })

  it('should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any@email.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any@email.com')
  })
})