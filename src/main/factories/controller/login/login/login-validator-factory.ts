import { 
  EmailValidation, 
  RequiredFieldsValidation, 
  ValidationComposite 
} from '@/validation/validation'
import { Validation } from '@/presentation/protocols/validation'
import EmailValidatorAdapter from '@/infra/validators/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for(const field of ['email', 'password'])
    validations.push(new RequiredFieldsValidation(field))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}