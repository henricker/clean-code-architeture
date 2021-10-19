import EmailValidatorAdapter from "./email-validator-adapter"
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail: (): boolean => true
}))

describe('EmailValidator Adapter', () => {
  it('should returns false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email.com')
    expect(isValid).toBe(false)
  })

  it('should returns true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid@email.com')
    expect(isValid).toBe(true)
  })
})