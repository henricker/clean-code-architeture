import app from '../config/app'
import env from '../config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import bcrypt from 'bcrypt'
import request from 'supertest'
import { Collection } from 'mongodb'

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
          name: 'henricker',
          email: 'henricker@email.com',
          password: 'MyHardPassword12301293012398@@@@1!2371739',
          passwordConfirmation: 'MyHardPassword12301293012398@@@@1!2371739'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const password = await bcrypt.hash('MyHardPassword12301293012398', 12)
      await accountCollection.insertOne({
        name: 'henricker',
        email: 'henricker@email.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'henricker@email.com',
          password: 'MyHardPassword12301293012398'
        })
        .expect(200)
       
    })
  })
})