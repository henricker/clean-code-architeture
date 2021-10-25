import { DbAddAccount } from './db-add-account'
import { Hasher, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'

interface SutType {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid@email.com',
  name: 'valid_name',
  password: 'hashed_password'
})

const makeFakeAccountData = () => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

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
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
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
      email: 'valid_email',
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
})