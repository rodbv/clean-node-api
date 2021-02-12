import { AddAccountModel } from '../../../domain/use-cases/add-account'
import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

class EncrypterStub implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return new Promise(resolve => resolve('hashed_password'))
  }
}

describe('DbAddAccount use case', () => {
  test('should call Encrypter interface with correct password', async () => {
    const encrypterStub = new EncrypterStub()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const sut = new DbAddAccount(encrypterStub)

    const validAccount: AddAccountModel = { name: 'valid_name', email: 'valid_email', password: 'valid_password' }
    await sut.add(validAccount)

    expect(encryptSpy).toBeCalledWith(validAccount.password)
  })
})
