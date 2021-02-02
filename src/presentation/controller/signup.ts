import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../protocols/bad-request'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'
export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      console.log('httpRequest.body[field]', httpRequest.body[field])
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
