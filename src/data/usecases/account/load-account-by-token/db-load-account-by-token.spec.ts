import { DbLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { mockAccountModel } from '@/__tests__/domain/mock-account'

interface ISutTypes {
  sut: DbLoadAccountByToken
  decrypter: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeFakeAccountModel = mockAccountModel()


const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async verify(value: string): Promise<string> {
      return 'any_value'
    }
  }

  return new DecrypterStub()
}

const makeLoadAccountByTokenRepositoryStub  = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return makeFakeAccountModel
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

const makeSut = (): ISutTypes => {
  const decrypter = makeDecrypterStub()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(decrypter, loadAccountByTokenRepositoryStub)

  return {
    sut, 
    decrypter,
    loadAccountByTokenRepositoryStub
  }
}


describe('DbLoadAccountByToken UseCase', () => {

  it('Should call Decrypter with correct values', async () => {
    const { sut, decrypter } = makeSut()
    const decryptSpy = jest.spyOn(decrypter, 'verify')
    await sut.load('access_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('access_token')
  })

  it('Should return null if Decrypter return null', async () => {
    const { sut, decrypter } = makeSut()
    jest.spyOn(decrypter, 'verify').mockResolvedValueOnce(null)
    const account = await sut.load('access_token', 'any_role')
    expect(account).toBeNull()
  })

  it('Should calls LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('access_token', 'any_role')
    expect(loadSpy).toHaveBeenCalledWith('access_token', 'any_role')
  })

  it('Should return null if LoadAccountByTokenRepository return null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)
    const account = await sut.load('access_token', 'any_role')
    expect(account).toBeNull()
  })

  it('Should return an account if LoadAccountByTokenRepository return an account', async () => {
    const { sut } = makeSut()
    const account = await sut.load('access_token', 'any_role')
    expect(account).toEqual(makeFakeAccountModel)
  })

  it('should throw if Decrypter throws', async () => {
    const { sut, decrypter } = makeSut()
    jest.spyOn(decrypter, 'verify').mockRejectedValueOnce(new Error())
    const promise = sut.load('access_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  it('should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockRejectedValueOnce(new Error())
    const promise = sut.load('access_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

})