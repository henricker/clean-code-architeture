import { MissingParamError } from "../../errors"
import { RequiredFieldsValidation } from "./required-fields-validation"

interface ISutType {
  sut: RequiredFieldsValidation
}


const makeSut = (): ISutType => {
  const sut = new RequiredFieldsValidation('fieldName')
  return {
    sut
  }
}

describe('RequiredFieldsValidation', () => {
  it('should return MissingParamError if fieldName not found on input', () => {
    const { sut } = makeSut()
    const mockInput = { field: 'fieldValue' }
    const error = sut.validate(mockInput)
    expect(error).toEqual(new MissingParamError('fieldName'))
  })

  it('should return null if fieldName exists on input', () => {
    const { sut } = makeSut()
    const mockInput = { fieldName: 'fieldValue' }
    const error = sut.validate(mockInput)
    expect(error).toBeFalsy()
  })
})