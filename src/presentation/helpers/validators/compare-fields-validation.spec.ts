import { InvalidParamError } from "../../errors"
import { CompareFieldsValidator } from "./compare-fields-validation"

interface ISutType {
  sut: CompareFieldsValidator
}


const makeSut = (): ISutType => {
  const sut = new CompareFieldsValidator('fieldName', 'fieldToCompare')
  return {
    sut
  }
}

describe('CompareFieldsValidation', () => {
  
  it('should return IvalidParamError if fieldName and fieldToCompare does not match', () => {
    const { sut } = makeSut()
    const error = sut.validate({ fieldName: 'value', fieldToCompare: 'otherValue' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('should return null if fieldName and fieldTocompare is match', () => {
    const { sut } = makeSut()
    const error = sut.validate({ fieldName: 'value', fieldToCompare: 'value' })
  })

})