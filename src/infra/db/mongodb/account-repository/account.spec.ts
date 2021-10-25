import { AccountMongoRepository } from "./account"
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from "mongodb"
import { AddAccountModel } from "../../../../domain/usecases/add-account"

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

const makeFakeAccount = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'any_password'
})

let accountCollection: Collection
describe('Account Mongo Repository', () => {
  
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('should return an account on success', async () => {
      const sut = makeSut();
      const account = await sut.add(makeFakeAccount())
  
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail()', () => {
    it('should return an account on success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(makeFakeAccount())
      const account = await sut.loadByEmail('any_email@email.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@email.com')
      expect(account.password).toBe('any_password')
    })

    it('should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email')
      expect(account).toBeFalsy()
    })
  })

})