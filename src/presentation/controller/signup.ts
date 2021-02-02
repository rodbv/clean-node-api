import { StatusCodes } from 'http-status-codes'
import { MissingParamError } from '../errors/missing-param-error'
import { httpRequest, httpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    const required = ['name', 'email']

    for (const field of required) {
      console.log('httpRequest.body[field]', httpRequest.body[field])
      if (!httpRequest.body[field]) {
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          body: new MissingParamError(field)
        }
      }
    }
  }
}
