import { EmailValidator } from '../../validation/protocols/email-validator'
import validator from 'validator'

export default class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    const isEmail = validator.isEmail(email)
    return isEmail
  }
}