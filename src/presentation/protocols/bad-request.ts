import { StatusCodes } from 'http-status-codes'
import { HttpResponse } from './http'

export const badRequest =
(error: Error, statusCode: number = StatusCodes.BAD_REQUEST): HttpResponse => ({
  statusCode,
  body: error
})
