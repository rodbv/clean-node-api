import { StatusCodes } from 'http-status-codes'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup'

const makeController = (): any => {
  class EmailValidatorStub implements EmailValidator {
    isValid (): boolean {
      return true
    }
  }

  const emailValidator = new EmailValidatorStub()
  const controller = new SignUpController(emailValidator)

  return { controller, emailValidator }
}

describe('SignUp controller', () => {
  test('should return 400 BAD_REQUEST if no name is provided', () => {
    const { controller } = makeController()
    const httpRequest = {
      body: {
        email: 'any-email@email.com',
        password: 'any-password',
        passwordConfirmation: 'any-password'
      }
    }
    const httpResponse = controller.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })

  test('should return 400 BAD_REQUEST if no email is provided', () => {
    const { controller } = makeController()
    const httpRequest = {
      body: {
        name: 'any-name',
        password: 'any-password',
        passwordConfirmation: 'any-password'
      }
    }
    const httpResponse = controller.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })

  test('should return 400 BAD_REQUEST if no password is provided', () => {
    const { controller } = makeController()
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'email@email.com',
        passwordConfirmation: 'any-password'
      }
    }
    const httpResponse = controller.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new Error('Missing param: password'))
  })

  test('should return 400 BAD_REQUEST if no passwordConfirmation is provided', () => {
    const { controller } = makeController()
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'email@email.com',
        password: 'any-password'
      }
    }
    const httpResponse = controller.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new Error('Missing param: passwordConfirmation'))
  })

  test('should return 400 if invalid email format is provided', () => {
    const { controller, emailValidator } = makeController()
    const emailValidatorSpy = jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'invalid',
        password: 'any-password',
        passwordConfirmation: 'any-password'
      }
    }
    const httpResponse = controller.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(httpResponse.body).toEqual(new Error('Invalid param: email'))
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should return 500 if emailValidator throws an error', () => {
    const { controller, emailValidator } = makeController()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => { throw new Error() })

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'invalid',
        password: 'any-password',
        passwordConfirmation: 'any-password'
      }
    }
    const httpResponse = controller.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(httpResponse.body).toEqual('Internal Server Error')
  })
})
