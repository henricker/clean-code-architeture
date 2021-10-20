import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('SignUp Routes', () => {
  
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

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