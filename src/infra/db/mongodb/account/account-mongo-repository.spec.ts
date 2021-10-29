import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { mockAddAccountParams } from '@/__tests__/domain/mock-account'
import { Collection } from 'mongodb'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

const makeFakeAccount = mockAddAccountParams()

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
      const account = await sut.add(makeFakeAccount)
  
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(makeFakeAccount.name)
      expect(account.email).toBe(makeFakeAccount.email)
      expect(account.password).toBe(makeFakeAccount.password)
    })
  })

  describe('loadByEmail()', () => {
    it('should return an account on success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(makeFakeAccount)
      const account = await sut.loadByEmail(makeFakeAccount.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(makeFakeAccount.name)
      expect(account.email).toBe(makeFakeAccount.email)
      expect(account.password).toBe(makeFakeAccount.password)
    })

    it('should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email')
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne(makeFakeAccount)
      const fakeAccount = res.ops[0]
      expect(fakeAccount.acessToken).toBeFalsy()
      await sut.updateAccessToken(fakeAccount._id, 'any_token')
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne(makeFakeAccount)
      const fakeAccount = res.ops[0]
      expect(fakeAccount.acessToken).toBeFalsy()
      await sut.updateAccessToken(fakeAccount._id, 'any_token')
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByTokenSuccess()', () => {
    
    it('should return an account with token without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({ 
        ...makeFakeAccount,
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(makeFakeAccount.name)
      expect(account.email).toBe(makeFakeAccount.email)
      expect(account.password).toBe(makeFakeAccount.password)
    })

    it('should return an account with token with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...makeFakeAccount,
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(makeFakeAccount.name)
      expect(account.email).toBe(makeFakeAccount.email)
      expect(account.password).toBe(makeFakeAccount.password)
    })

    it('Should return null on loadByToken with invaid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...makeFakeAccount,
        accessToken: 'any_token',
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })

    it('Should return an account on loadByToken with if use is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...makeFakeAccount,
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(makeFakeAccount.name)
      expect(account.email).toBe(makeFakeAccount.email)
      expect(account.password).toBe(makeFakeAccount.password)
    })

    it('should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })

  })
})