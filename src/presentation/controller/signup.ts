import { StatusCodes } from 'http-status-codes'

export class SignUpController {
  handle (httpRequest: any): any {
    const required = ['name', 'email']

    for (const field of required) {
      console.log('httpRequest.body[field]', httpRequest.body[field])
      if (!httpRequest.body[field]) {
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          body: new Error(`Missing param: ${field}`)
        }
      }
    }
  }
}
