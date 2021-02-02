import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../protocols/bad-request'
import { httpRequest, httpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    const required = ['name', 'email']

    for (const field of required) {
      console.log('httpRequest.body[field]', httpRequest.body[field])
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
