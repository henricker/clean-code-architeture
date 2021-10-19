import EmailValidatorAdapter from "./email-validator-adapter"

describe('EmailValidator Adapter', () => {
  it('should returns false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email.com')
    expect(isValid).toBe(false)
  })
})