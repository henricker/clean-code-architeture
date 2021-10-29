import app from '../config/app'
import env from '../config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { mockAddAccountParams } from '@/__tests__/domain/mock-account'
import bcrypt from 'bcrypt'
import request from 'supertest'
import { Collection } from 'mongodb'

const makeAddAccountParams = mockAddAccountParams()

let accountCollection: Collection
describe('Login Routes', () => {
  
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    it('should return an account', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          ...makeAddAccountParams,
          passwordConfirmation: makeAddAccountParams.password,
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const password = await bcrypt.hash(makeAddAccountParams.password, 12)
      await accountCollection.insertOne({
        ...makeAddAccountParams,
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: makeAddAccountParams.email,
          password: makeAddAccountParams.password
        })
        .expect(200)
       
    })
  })
})