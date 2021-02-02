import { StatusCodes } from 'http-status-codes'
import { SignUpController } from './signup'

const makeController = (): SignUpController => {
  class EmailValidatorStub {
    isValid (email: string): boolean {
      return email.indexOf('@') > 0
    }
  }
  return new SignUpController(new EmailValidatorStub())
}

describe('SignUp controller', () => {
  test('should return 400 BAD_REQUEST if no name is provided', () => {
    const sut = makeController()
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

  test('should return 400 BAD_REQUEST if no email is provided', () => {
    const sut = makeController()
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

  test('should return 400 BAD_REQUEST if no password is provided', () => {
    const sut = makeController()
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'email@email.com',
        passwordConfirmation: 'any-password'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new Error('Missing param: password'))
  })

  test('should return 400 BAD_REQUEST if no passwordConfirmation is provided', () => {
    const sut = makeController()
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'email@email.com',
        password: 'any-password'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new Error('Missing param: passwordConfirmation'))
  })

  test('should return 400 if invalid email format is provided', () => {
    const sut = makeController()
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'invalid',
        password: 'any-password',
        passwordConfirmation: 'any-password'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    console.log('httpResponse.body =>', httpResponse.body, '<=')

    expect(httpResponse.body).toEqual(new Error('Invalid param: email'))
  })
})
