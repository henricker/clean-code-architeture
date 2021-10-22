import { MongoHelper } from "../../../infra/db/mongodb/helpers/mongo-helper";
import { LogErrorRepository } from "../../protocols/log-error-repository";

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorCollection = MongoHelper.getCollection('errors')
    await (await errorCollection).insertOne({
      stack,
      date: new Date()
    })
    throw new Error("Method not implemented.");
  }
}