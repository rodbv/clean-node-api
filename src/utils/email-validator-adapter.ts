import validator from 'validator'

import { EmailValidator } from '../presentation/controller/signup/email-validator'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean { return validator.isEmail(email) }
}
