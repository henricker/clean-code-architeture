import { CompareFieldsValidator } from "../../../presentation/helpers/validators/compare-fields-validation"
import { EmailValidation } from "../../../presentation/helpers/validators/email-validation"
import { RequiredFieldsValidation } from "../../../presentation/helpers/validators/required-fields-validation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite"
import { Validation } from "../../../presentation/protocols/validation"
import EmailValidatorAdapter from "../../../utils/email-validator-adapter"
import { makeSignUpValidation } from "./signup-validation-factory"

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('SignupValidationFactory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for(const field of ['name', 'email', 'password', 'passwordConfirmation'])
      validations.push(new RequiredFieldsValidation(field))
    validations.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})