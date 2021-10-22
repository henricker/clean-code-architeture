import { Collection } from "mongodb"
import { env } from "process"
import { MongoHelper } from "../../../infra/db/mongodb/helpers/mongo-helper"
import { LogMongoRepository } from "./log"

interface ISutType {
  sut: LogMongoRepository
}

const makeSut = (): ISutType => {
  const sut = new LogMongoRepository()
  return {
    sut
  }
}

describe('LogMongoRepository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  it('should create a error log on success', async () => {
    const { sut } = makeSut()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})