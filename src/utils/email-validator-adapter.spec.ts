import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter()

describe('email validator adapter', () => {
  test('should return false if validator returns false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const sut = makeSut()
    const isValid = sut.isValid('invalid_email.com')
    expect(isValid).toBe(false)
  })

  test('should return true if validator returns true', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)
    const sut = makeSut()
    const isValid = sut.isValid('valid@email.com')
    expect(isValid).toBe(true)
  })

  test('should call validator passing the email param', () => {
    const spy = jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)

    const validEmail = 'this_is@valid.com'
    const sut = makeSut()

    sut.isValid(validEmail)
    expect(spy).toBeCalledWith(validEmail)
  })
})
