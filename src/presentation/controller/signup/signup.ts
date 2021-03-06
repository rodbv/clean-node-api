import { InvalidParamError } from '../../errors'
import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest, created, internalServerError } from '../../protocols/http-helper'
import { Controller } from '../../protocols/controller'
import { EmailValidator } from './email-validator'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { AddAccount } from '../../../domain/use-cases/add-account'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const account = await this.addAccount.add({ name, email, password })

      return created(account)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
