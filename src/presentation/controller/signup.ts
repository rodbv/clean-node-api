import { InvalidParamError } from '../errors'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, internalServerError } from '../protocols/http-errors'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { AddAccount } from '../../domain/use-cases/add-account'
import { StatusCodes } from 'http-status-codes'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      const { body } = httpRequest

      for (const field of requiredFields) {
        if (!body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (!this.emailValidator.isValid(body.email)) {
        return badRequest(new InvalidParamError('email'))
      }

      if (body.password !== body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const account = this.addAccount.add(body)

      return { statusCode: StatusCodes.CREATED, body: account }
    } catch (error) {
      return internalServerError()
    }
  }
}
