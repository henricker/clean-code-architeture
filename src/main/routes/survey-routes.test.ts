import { sign } from 'jsonwebtoken'
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
  ],
  date: new Date('2021-10-27T16:16:47.696Z')
})

let surveyCollection: Collection
let accountCollection: Collection
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
        .send(makeFakeSurveyData())
        .expect(403)
    })

    it('should return 204 on add survey with valid accessToken', async () => {
      const res = await accountCollection.insertOne({
        name: 'henricker',
        email: 'henricker@email.com',
        password: 'any_password',
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

      await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send(makeFakeSurveyData())
      .expect(204)
    })
  })

  describe('GET /surveys', () => {
    
    it('should return 403 if no x-access-token provided', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    // it('should return 204 on add survey with valid accessToken', async () => {
    //   const res = await accountCollection.insertOne({
    //     name: 'henricker',
    //     email: 'henricker@email.com',
    //     password: 'any_password',
    //     role: 'admin'
    //   })

    //   const id = res.ops[0]._id
    //   const accessToken = sign({ id }, env.secret)
    //   await accountCollection.update({
    //     _id: id,
    //   }, {
    //     $set: {
    //       accessToken
    //     }
    //   })

    //   await request(app)
    //   .post('/api/surveys')
    //   .set('x-access-token', accessToken)
    //   .send(makeFakeSurveyData())
    //   .expect(204)
    // })
  })

})