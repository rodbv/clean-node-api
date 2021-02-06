import { StatusCodes } from 'http-status-codes'
import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/use-cases/add-account'
import { EmailValidator } from './email-validator'
import { SignUpController } from './signup'

interface MakeSutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
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
      const { name, email } = account
      return {
        id: 'valid_id',
        name,
        email
      }
    }
  }

  return new AddAccountStub()
}

const makeSut = (): MakeSutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return { sut, emailValidatorStub, addAccountStub }
}

const makePayload = ({ removeField = '' } = {}): any => {
  const validPayload = {
    name: 'any-name',
    email: 'any-email@email.com',
    password: 'any-password',
    passwordConfirmation: 'any-password'
  }

  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  removeField && delete validPayload[removeField]

  return validPayload
}

describe('SignUp controller', () => {
  describe('validation', () => {
    test('should return 400 if no name is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: makePayload({ removeField: 'name' })
      }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(httpResponse.body).toEqual(new Error('Missing param: name'))
    })

    test('should return 400 if no email is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: makePayload({ removeField: 'email' })
      }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(httpResponse.body).toEqual(new Error('Missing param: email'))
    })

    test('should return 400 if no password is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: makePayload({ removeField: 'password' })
      }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(httpResponse.body).toEqual(new Error('Missing param: password'))
    })

    test('should return 400 if no passwordConfirmation is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: makePayload({ removeField: 'passwordConfirmation' })
      }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(httpResponse.body).toEqual(new Error('Missing param: passwordConfirmation'))
    })

    test('should return 400 if password and passwordConfirmation don\'t match', () => {
      const { sut } = makeSut()
      const payload = makePayload()
      payload.passwordConfirmation = 'invalid'

      const httpResponse = sut.handle({ body: payload })

      expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(httpResponse.body).toEqual(new Error('Invalid param: passwordConfirmation'))
    })

    test('should return 400 if invalid email format is provided', () => {
      const { sut, emailValidatorStub } = makeSut()
      const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

      const payload = makePayload()
      payload.email = 'invalid'

      const httpResponse = sut.handle({ body: payload })

      expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(httpResponse.body).toEqual(new Error('Invalid param: email'))
      expect(emailValidatorSpy).toHaveBeenCalledWith(payload.email)
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
    test('uses addAccount function and returns 201 if signup controller is called with valid payload', () => {
      const { sut, addAccountStub } = makeSut()
      const addAccountSpy = jest.spyOn(addAccountStub, 'add')

      const httpRequest = { body: makePayload() }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(StatusCodes.CREATED)

      expect(httpResponse.body.id).toEqual('valid_id')
      expect(addAccountSpy).toBeCalledTimes(1)
      expect(addAccountSpy).toBeCalledWith({
        name: httpRequest.body.name,
        email: httpRequest.body.email,
        password: httpRequest.body.password
      })
    })

    test('should return 500 if addAccount throws an error', () => {
      const { sut, addAccountStub } = makeSut()

      jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new Error() })

      const httpRequest = { body: makePayload() }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(httpResponse.body).toEqual('Internal Server Error')
    })
  })
})
