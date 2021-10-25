import { BcryptAdapter } from "./bcrypt-adapter"
import bcrypt, { compareSync } from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hashed_value'
  },
  async compare(): Promise<boolean> {
    return true
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

  describe('Hash()', () => {
    
    it('Should call hash with correct values', async () => {
      const salt = 12
      const { sut } = makeSut(salt)
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })
  
    it('Should return a hash on success', async () => {
      const salt = 12
      const { sut } = makeSut(salt)
      const hashedValue = await sut.hash('any_value')
      expect(hashedValue).toBe('hashed_value')
    })
  
    it('Should throw if hash throws', async () => {
      const salt = 12
      const { sut } = makeSut(salt)
      jest.spyOn(bcrypt as any, 'hash').mockRejectedValueOnce(new Error())
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    it('should call compare with correct values', async () => {
      const { sut } = makeSut(12)

      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })
    it.todo('should return true when compare succeeds')
    it.todo('should return false when compare fails')
    it.todo('should throw if compare throws')
  })

})