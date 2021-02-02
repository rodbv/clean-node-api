import { StatusCodes } from 'http-status-codes'
import { httpResponse } from './http'

export const badRequest =
(error: Error, statusCode: number = StatusCodes.BAD_REQUEST): httpResponse => ({
  statusCode,
  body: error
})
