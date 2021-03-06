import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { mockAddSurveyParams, mockSurveyModels } from '@/__tests__/domain/mock-survey'
import { Collection } from 'mongodb'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeFakeSurveyData = mockAddSurveyParams()
const makeFakeSurveysData = mockSurveyModels().map(c => ({ ...c, id: undefined }))

let surveyCollection: Collection
describe('Survey Mongo Repository', () => {
  
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    it('should return an account on add success', async () => {
      const sut = makeSut()
      await sut.add(makeFakeSurveyData)
  
      const survey = await surveyCollection.findOne({ question: makeFakeSurveyData.question })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    
    it('should load all surveys on success', async () => {
      await surveyCollection.insertMany(makeFakeSurveysData)
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(makeFakeSurveysData[0].question)
      expect(surveys[1].question).toBe(makeFakeSurveysData[1].question)
    })
  
    it('should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  
  })

  describe('loadById()', () => {
    it('should load a survey on success', async () => {
      const res = await surveyCollection.insertOne(makeFakeSurveyData)
      const id = res.ops[0]._id
      const sut = makeSut()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})