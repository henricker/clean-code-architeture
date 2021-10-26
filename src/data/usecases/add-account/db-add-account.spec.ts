import { DbAddAccount } from './db-add-account'
import { Hasher, AccountModel, AddAccountModel, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'

interface SutType {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid@email.com',
  name: 'valid_name',
  password: 'hashed_password'
})

const makeFakeAccountData = () => ({
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

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
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
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
    await sut.add(makeFakeAccountData())
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  it('should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAccountData())
    expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      email: 'valid_email@email.com',
      name: 'valid_name',
      password: 'hashed_password'
    })  
  })

  it('should throw if hasher throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAccountData())
    expect(promise).rejects.toThrow()
  })

  it('should return an account if on success', async () => {
    const { sut  } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })

  it('should return null if LoadAccountEmailRepository no returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub  } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(makeFakeAccount())
    const account = await sut.add(makeFakeAccountData())
    expect(account).toBeNull()
  })

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(makeFakeAccountData())
    expect(loadSpy).toHaveBeenCalledWith('valid_email@email.com')
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const {  sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })
})