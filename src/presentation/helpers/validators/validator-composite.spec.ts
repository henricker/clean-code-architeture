import { Validation } from '../../protocols/validation'
import { ValidationComposite } from './validation-composite'


interface ISutType {
  sut: ValidationComposite
  validations: Validation[]
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): ISutType => {
  const validations = [makeValidationStub(), makeValidationStub()]
  const sut = new ValidationComposite(validations)
  return {
    sut,
    validations
  }
}

describe('ValidationComposite', () => {
  it('should call validate of validations method', () => {
    const { sut, validations } = makeSut()
    const validateSpy = jest.spyOn(validations[0], 'validate')
    sut.validate({ anyFieldName: 'anyValue' })
    expect(validateSpy).toBeCalledWith({ anyFieldName: 'anyValue' })
  })

  it('should return first error of array if hash more than one errors', () => {
    const { sut, validations } = makeSut()
    jest.spyOn(validations[0], 'validate').mockReturnValueOnce(new Error('first_error'))
    jest.spyOn(validations[0], 'validate').mockReturnValue(new Error('second_error'))
    const error = sut.validate({ anyFieldName: 'anyValue' })
    expect(error).toEqual(new Error('first_error'))
  })

  it('should throws if some validation of array throws', () => {
    const { sut, validations } = makeSut()
    jest.spyOn(validations[0], 'validate').mockImplementationOnce((input: any) => { throw new Error('any_error') })
    expect(sut.validate).toThrow()
  })

  it('should return null on success', () => {
    const { sut } = makeSut()
    const error = sut.validate({ anyFieldName: 'anyValue' })
    expect(error).toBeFalsy()
  })
})