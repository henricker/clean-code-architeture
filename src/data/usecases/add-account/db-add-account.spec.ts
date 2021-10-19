import { DbAddAccount } from "./db-add-account"
import { Encrypter, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'

interface SutType {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        email: 'valid@email.com',
        name: 'valid_name',
        password: 'hashed_password'
      }
      return new Promise((resolve) => resolve(fakeAccount))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(validPassword: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}
const makeSut = (): SutType => {
  const encrypterStub = makeEncrypterStub()
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())

    const promise = sut.add(accountData)
    expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid@email.com',
      password: 'valid_password'
    }

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      email: 'valid@email.com',
      name: 'valid_name',
      password: 'hashed_password'
    })  
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())

    const promise = sut.add(accountData)
    expect(promise).rejects.toThrow()
  })
})