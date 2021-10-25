import { EmailValidation } from "../../../presentation/helpers/validators/email-validation"
import { RequiredFieldsValidation } from "../../../presentation/helpers/validators/required-fields-validation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite"
import { Validation } from "../../../presentation/protocols/validation"
import EmailValidatorAdapter from "../../adapters/validators/email-validator-adapter"
import { makeLoginValidation } from "./login-validator-factory"


jest.mock('../../../presentation/helpers/validators/validation-composite')

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