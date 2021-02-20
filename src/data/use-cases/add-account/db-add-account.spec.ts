import { AddAccount, AddAccountModel } from '../../../domain/use-cases/add-account'
import { DbAddAccount } from './db-add-account'
import { Encrypter } from './db-add-account-protocols'

interface SutTypes {
  sut: AddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return { encrypterStub, sut }
}

describe('DbAddAccount use case', () => {
  const validAccount: AddAccountModel = { name: 'valid_name', email: 'valid_email', password: 'valid_password' }

  test('should call Encrypter interface with correct password', async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(validAccount)

    expect(encryptSpy).toBeCalledWith(validAccount.password)
  })

  test('should throw if encrypter throws an error', async () => {
    const { encrypterStub, sut } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.add(validAccount)
    await expect(promise).rejects.toThrow()
  })
})
