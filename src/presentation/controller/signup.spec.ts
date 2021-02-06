import { StatusCodes } from 'http-status-codes'
import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/use-cases/add-account'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup'

interface MakeSutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid@email.com',
        password: 'valid_password'
      }
    }
  }

  return new AddAccountStub()
}

const makeSut = (): MakeSutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return { sut, emailValidatorStub }
}

describe('SignUp controller', () => {
  describe('validation', () => {
    test('should return 400 if no name is provided', () => {
      const { sut } = makeSut()
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
      const { sut } = makeSut()
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

    test('should return 400 if no password is provided', () => {
      const { sut } = makeSut()
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

    test('should return 400 if no passwordConfirmation is provided', () => {
      const { sut } = makeSut()
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

    test('should return 400 if password and passwordConfirmation don\'t match', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'any-name',
          email: 'email@email.com',
          password: 'any-password',
          passwordConfirmation: 'different'
        }
      }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(httpResponse.body).toEqual(new Error('Invalid param: passwordConfirmation'))
    })

    test('should return 400 if invalid email format is provided', () => {
      const { sut, emailValidatorStub } = makeSut()
      const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
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
      const { sut, emailValidatorStub } = makeSut()

      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

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

  describe('add account', () => {
    test('returns 201 if signup controller is called with valid payload', () => {
      const { sut } = makeSut()

      const httpRequest = {
        body: {
          name: 'any-name',
          email: 'invalid',
          password: 'any-password',
          passwordConfirmation: 'any-password'
        }
      }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(StatusCodes.CREATED)
      expect(httpResponse.body.id).toEqual('valid_id')
    })
  })
})
