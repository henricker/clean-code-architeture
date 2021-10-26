import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-decorator'

export const makeLogDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  const logControllerDecorator = new LogControllerDecorator(controller, logMongoRepository)
  return logControllerDecorator
}