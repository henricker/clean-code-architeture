import { AuthMiddleware } from './auth-middleware'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { HttpRequest } from '../protocols'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/Account'

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

interface ISutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeFakeAccountModel = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})


const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return makeFakeAccountModel()
    }
  }

  return new LoadAccountByTokenStub()
}

const makeSut = (role?: string): ISutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  
  it('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

    // test('Should call LoadAccountByToken with correct accessToken', async () => {
  //   const role = 'any_role'
  //   const { sut, loadAccountByTokenSpy } = makeSut(role)
  //   const httpRequest = mockRequest()
  //   await sut.handle(httpRequest)
  //   expect(loadAccountByTokenSpy.accessToken).toBe(httpRequest.accessToken)
  //   expect(loadAccountByTokenSpy.role).toBe(role)
  // })

  // test('Should return 403 if LoadAccountByToken returns null', async () => {
  //   const { sut, loadAccountByTokenSpy } = makeSut()
  //   loadAccountByTokenSpy.result = null
  //   const httpResponse = await sut.handle(mockRequest())
  //   expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  // })

  // test('Should return 200 if LoadAccountByToken returns an account', async () => {
  //   const { sut, loadAccountByTokenSpy } = makeSut()
  //   const httpResponse = await sut.handle(mockRequest())
  //   expect(httpResponse).toEqual(ok({
  //     accountId: loadAccountByTokenSpy.result.id
  //   }))
  // })

  // test('Should return 500 if LoadAccountByToken throws', async () => {
  //   const { sut, loadAccountByTokenSpy } = makeSut()
  //   jest.spyOn(loadAccountByTokenSpy, 'load').mockImplementationOnce(throwError)
  //   const httpResponse = await sut.handle(mockRequest())
  //   expect(httpResponse).toEqual(serverError(new Error()))
  // })

})