import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { 
  RequiredFieldsValidation, 
  ValidationComposite 
} from '@/validation/validation'
import { Validation } from '@/presentation/protocols/validation'

jest.mock('../../../../../validation/validation/validation-composite')

describe('SignupValidationFactory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for(const field of ['question', 'answers'])
      validations.push(new RequiredFieldsValidation(field))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})