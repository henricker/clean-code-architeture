import { 
  CompareFieldsValidation, 
  EmailValidation, 
  RequiredFieldsValidation, 
  ValidationComposite 
} from '../../../../validation/validation'
import { Validation } from '../../../../presentation/protocols/validation'
import EmailValidatorAdapter from '../../../../infra/validators/email-validator-adapter'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../../validation/validation/validation-composite')

describe('SignupValidationFactory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for(const field of ['name', 'email', 'password', 'passwordConfirmation'])
      validations.push(new RequiredFieldsValidation(field))
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})