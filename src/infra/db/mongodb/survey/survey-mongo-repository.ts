import { AddSurveyRepository } from "../../../../data/usecases/add-survey/db-add-survey-protocols";
import { AddSurveyModel } from "../../../../domain/usecases/add-survey";
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const result = await surveyCollection.insertOne({ ...data })
    const survey = MongoHelper.map(result.ops[0])
    return survey
  }
}