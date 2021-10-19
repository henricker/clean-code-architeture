import { Encrypter } from "../../protocols/encrypter"
import { DbAddAccount } from "./db-add-account"

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(validPassword: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}
const makeSut = () => {
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccount(encrypterStub)
  
  return {
    sut,
    encrypterStub
  }
}
describe('DbAddAccount UseCase', () => {
  it('should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})