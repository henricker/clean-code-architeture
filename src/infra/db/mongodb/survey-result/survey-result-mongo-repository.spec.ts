import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { SurveyModel } from '@/domain/models/Survey'
import { AccountModel } from '@/domain/models/Account'
import { mockAddSurveyParams } from '@/__tests__/domain/mock-survey'
import { mockAddAccountParams } from '@/__tests__/domain/mock-account'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())

  return MongoHelper.map(res.ops[0])
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return MongoHelper.map(res.ops[0])
}



describe('Survey Result Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyCollection.deleteMany({})
  })

  describe('save()', () => {

    it('Should add a survey result if its new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date('2021-10-27T16:16:47.696Z')
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id)
      })
      expect(surveyResult).toBeTruthy()
    })

    it('Should update survey result if its not new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date('2021-10-27T16:16:47.696Z')
      })
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date('2021-10-27T16:16:47.696Z')
      })
      
      const surveyResult = await surveyResultCollection.find({
        accountId: new ObjectId(account.id),
        surveyId: new ObjectId(survey.id)
      }).toArray()

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)

    })
  })

  describe('LoadById()', () => {
    it('Should be load survey result', async () => {
      const survey = await makeSurvey()
      const accountId =  (await makeAccount()).id
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[1].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[1].answer,
          date: new Date()
        },
      ])

      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
    })
  })
})