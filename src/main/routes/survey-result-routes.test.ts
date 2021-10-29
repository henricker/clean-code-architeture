import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import { mockAddAccountParams } from '@/__tests__/domain/mock-account'
import { mockSurveyModel } from '@/__tests__/domain/mock-survey'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection

const makeAddAccountParams = mockAddAccountParams()
const makeAddSurveyParams = { ...mockSurveyModel(), id: undefined }

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne(makeAddAccountParams)
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.secret)
  await accountCollection.updateOne({
    _id: res.ops[0]._id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    it('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    it('Should return 200 on save survey result with accessToken', async () => {
      const accessToken = await mockAccessToken()
      const res = await surveyCollection.insertOne(makeAddSurveyParams)

      await request(app)
        .put(`/api/surveys/${res.ops[0]._id.toHexString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: makeAddSurveyParams.answers[0].answer
        })
        .expect(200)
    })
  })
})