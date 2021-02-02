import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../protocols/bad-request'
import { httpRequest, httpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      console.log('httpRequest.body[field]', httpRequest.body[field])
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
