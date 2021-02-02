import { StatusCodes } from 'http-status-codes'
import { HttpResponse } from './http'

export const internalServerError =
(message?: string): HttpResponse => ({
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  body: message || 'Internal Server Error'
})
