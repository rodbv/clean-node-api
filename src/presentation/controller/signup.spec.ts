import { StatusCodes } from 'http-status-codes'
import { SignUpController } from './signup'

describe('SignUp controller', () => {
  test('should return 400 if no name is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any-email@email.com',
        password: 'any-password',
        passwordConfirmation: 'any-password'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })

  test('should return 400 if no email is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any-name',
        password: 'any-password',
        passwordConfirmation: 'any-password'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })
})
