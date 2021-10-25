import { JwtAdapter } from "./jwt-adapter"
import jwt from 'jsonwebtoken'

interface ISutType {
  sut: JwtAdapter
}

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'any_token'
  },

  async verify (): Promise<string> {
    return 'any_value'
  }
}))

const makeSut = (): ISutType => {
  const sut = new JwtAdapter('secret')
  return {
    sut
  }
}

describe('Jwt Adapter', () => {
  
  it('should call sign method of jwt', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
 
  it('should throw if sign method of jwt throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(jwt as any, 'sign').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})