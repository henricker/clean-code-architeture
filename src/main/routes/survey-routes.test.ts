import { Collection } from 'mongodb'
import request from 'supertest'
import { AddSurveyModel } from '../../domain/usecases/add-survey'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        answer: 'other_answer'
      }
  ]
})

let surveyCollection: Collection
describe('Survey Routes', () => {
  
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    it('should return an account', async () => {
      const response = await request(app)
        .post('/api/surveys')
        .send(makeFakeSurveyData())
        .expect(403)
    })
  })

})