import { makeLoginValidation } from './login-validator-factory'
import { RequiredFieldsValidation, ValidationComposite, EmailValidation } from '@/validation/validation'
import { Validation } from '@/presentation/protocols/validation'
import EmailValidatorAdapter from '@/infra/validators/email-validator-adapter'


jest.mock('../../../../../validation/validation/validation-composite')

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldsValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})