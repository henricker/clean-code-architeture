import { EmailValidation } from './email-validation'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '@/presentation/errors'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}


describe('EmailValidation', () => {

  it('should return an InvalidParamError if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const mockObject = { email: 'invalid_email' }
    const error = sut.validate(mockObject)

    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const mockObject = { email: 'invalid_email' }
    sut.validate(mockObject)
  })

  it('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email) => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })

})