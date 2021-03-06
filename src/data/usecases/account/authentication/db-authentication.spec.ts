import { DbAuthentication } from './db-authentication';
import { 
  AuthenticationParams,
  HashComparer,
  AccountModel,
  LoadAccountByEmailRepository, 
  Encrypter, 
  UpdateAccessTokenRepository 
} from './db-authentication-protocols';
import { mockAccountModel, mockAuthenticationParams } from '@/__tests__/domain/mock-account'

const makeFakeAccountModel = { ...mockAccountModel(), password: 'hashed_password' }
const makeFakeAuthenticationParams = mockAuthenticationParams()

interface ISutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeLoadAccountEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return makeFakeAccountModel
    }
  }

  return new LoadAccountEmailRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

const makeEncrypterStub = (): Encrypter => {
  class encrypterStub implements Encrypter {
    async sign(id: string): Promise<string> {
      return "any_token"
    }
  }

  return new encrypterStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, accessToken: string): Promise<void> {}
  }

  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): ISutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountEmailRepositoryStub()
  const hashComparerStub = makeHashComparerStub()
  const encrypterStub = makeEncrypterStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthenticationParams)
    expect(loadSpy).toHaveBeenCalledWith(makeFakeAuthenticationParams.email)
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const {  sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthenticationParams)
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const accesstoken = await sut.auth(makeFakeAuthenticationParams)
    expect(accesstoken).toBeNull()
  })

  it('Should call HashCompare with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthenticationParams)
    expect(compareSpy).toHaveBeenCalledWith(makeFakeAuthenticationParams.password, 'hashed_password')
  })

  it('Should throw if HashCompare throws', async () => {
    const {  sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthenticationParams)
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if HashCompare returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const accesstoken = await sut.auth(makeFakeAuthenticationParams)
    expect(accesstoken).toBeNull()
  })

  it('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'sign')
    await sut.auth(makeFakeAuthenticationParams)
    expect(generateSpy).toHaveBeenCalledWith(makeFakeAccountModel.id)
  })

  it('Should throw if Encrypter throws', async () => {
    const {  sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'sign').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthenticationParams)
    await expect(promise).rejects.toThrow()
  })

  it('Should return access token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthenticationParams)
    expect(accessToken).toBe('any_token')
  })

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthenticationParams)
    expect(updateSpy).toHaveBeenCalledWith(makeFakeAccountModel.id, 'any_token')
  })

  it('Should throw if UpdateAccessTokenRepository throws', async () => {
    const {  sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthenticationParams)
    await expect(promise).rejects.toThrow()
  })

})