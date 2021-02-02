import { StatusCodes } from 'http-status-codes'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup'

class EmailValidatorStub {
  isValid (): boolean {
    return true
  }
}
const makeController = (emailValidator?: EmailValidator): SignUpController => {
  return new SignUpController(emailValidator || new EmailValidatorStub())
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
    const emailValidatorStub = new EmailValidatorStub()
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const sut = makeController(emailValidatorStub)
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
    expect(httpResponse.body).toEqual(new Error('Invalid param: email'))
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should return 500 if emailValidator throws an error', () => {
    class BrokenEmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }

    const sut = makeController(new BrokenEmailValidatorStub())
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'invalid',
        password: 'any-password',
        passwordConfirmation: 'any-password'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(httpResponse.body).toEqual('Internal Server Error')
  })
})
