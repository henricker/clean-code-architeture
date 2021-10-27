import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidParamError } from '@/presentation/errors'

type SutTypes = {
  sut: CompareFieldsValidation
}


const makeSut = (): SutTypes => {
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