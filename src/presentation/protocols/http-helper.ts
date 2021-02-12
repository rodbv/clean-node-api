import { StatusCodes } from 'http-status-codes'
import { ServerError } from '../errors'
import { HttpResponse } from './http'

export const ok =
(body: any): HttpResponse => ({
  statusCode: StatusCodes.OK,
  body
})
export const created =
(body: any): HttpResponse => ({
  statusCode: StatusCodes.CREATED,
  body
})

export const badRequest =
(error: Error): HttpResponse => ({
  statusCode: StatusCodes.BAD_REQUEST,
  body: error
})

export const internalServerError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
