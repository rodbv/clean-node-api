import { StatusCodes } from 'http-status-codes'

export class SignUpController {
  handle (httpRequest: any): any {
    return { statusCode: StatusCodes.BAD_REQUEST }
  }
}
