import { Encrypter } from "../../data/protocols/encrypter"
import { BcryptAdapter } from "./bcrypt-adapter"
import bcrypt from 'bcrypt'

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

})