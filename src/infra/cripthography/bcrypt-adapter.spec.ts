import { BcryptAdapter } from "./bcrypt-adapter"
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hashed_value'))
  }
}))

interface SutTypes {
  sut: BcryptAdapter
}

const makeSut = (salt: number): SutTypes => {
  const sut = new BcryptAdapter(12)
  return {
    sut
  }
}
describe('Bcrypt Adapter', () => {

  it('Should call bcrypt with correct values', async () => {
    const salt = 12
    const { sut } = makeSut(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Should return a hash on success', async () => {
    const salt = 12
    const { sut } = makeSut(salt)
    const hashedValue = await sut.encrypt('any_value')
    expect(hashedValue).toBe('hashed_value')
  })

  it('Should throw if bcrypt throws', async () => {
    const salt = 12
    const { sut } = makeSut(salt)
    jest.spyOn(bcrypt as any, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })

})