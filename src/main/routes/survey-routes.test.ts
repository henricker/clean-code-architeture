import app from '../config/app'
import env from '../config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { mockAddSurveyParams } from '@/__tests__/domain/mock-survey'
import { mockAddAccountParams } from '@/__tests__/domain/mock-account'


let surveyCollection: Collection
let accountCollection: Collection

const makeFakeSurveyData = mockAddSurveyParams()
const makeFakeAccountData = mockAddAccountParams()

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    ...makeFakeAccountData,
    role: 'admin'
  })

  const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await accountCollection.update({
        _id: id,
      }, {
        $set: {
          accessToken
        }
      })

  return accessToken
}

describe('Survey Routes', () => {
  
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    
    it('should return 403 if no x-access-token provided', async () => {
      await request(app)
        .post('/api/surveys')
        .send(makeFakeSurveyData)
        .expect(403)
    })

    it('should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send(makeFakeSurveyData)
      .expect(204)
    })
  })

  describe('GET /surveys', () => {
    
    it('Should return 403 if no x-access-token provided', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    it('Should return 204 on load surveys with valid access token', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
      .get('/api/surveys')
      .set('x-access-token', accessToken)
      .expect(204)
    })

  })

})