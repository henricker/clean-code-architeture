import { DbAddAccount } from './db-add-account'
import { Hasher, AccountModel, AddAccountParams, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'
import { mockAccountModel, mockAddAccountParams } from '@/__tests__/domain/mock-account'

interface SutType {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const mockFakeAccountModel = mockAccountModel()

const mockFakeAddAccountParams = mockAddAccountParams()

const makeLoadAccountEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return null
    }
  }

  return new LoadAccountEmailRepositoryStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountParams): Promise<AccountModel> {
      return new Promise((resolve) => resolve(mockFakeAccountModel))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(validPassword: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new HasherStub()
}
const makeSut = (): SutType => {
  const hasherStub = makeHasherStub()
  const loadAccountByEmailRepositoryStub = makeLoadAccountEmailRepositoryStub()
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}
describe('DbAddAccount UseCase', () => {
  
  it('should call hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockFakeAddAccountParams)
    expect(hashSpy).toHaveBeenCalledWith(mockFakeAddAccountParams.password)
  })

  it('should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockFakeAddAccountParams)
    expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(mockFakeAddAccountParams)
    expect(addSpy).toHaveBeenCalledWith({...mockFakeAddAccountParams, password: 'hashed_password'})  
  })

  it('should throw if hasher throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockFakeAddAccountParams)
    expect(promise).rejects.toThrow()
  })

  it('should return an account if on success', async () => {
    const { sut  } = makeSut()
    const account = await sut.add(mockFakeAddAccountParams)
    expect(account).toEqual(mockFakeAccountModel)
  })

  it('should return null if LoadAccountEmailRepository no returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub  } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(mockFakeAccountModel)
    const account = await sut.add(mockFakeAddAccountParams)
    expect(account).toBeNull()
  })

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockFakeAddAccountParams)
    expect(loadSpy).toHaveBeenCalledWith(mockFakeAddAccountParams.email)
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const {  sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockFakeAddAccountParams)
    await expect(promise).rejects.toThrow()
  })
})