import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

interface ISutType {
  sut: CompareFieldsValidation
}


const makeSut = (): ISutType => {
  const sut = new CompareFieldsValidation('fieldName', 'fieldToCompare')
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