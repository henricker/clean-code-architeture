import { LoadSurveyController } from "../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller";
import { Controller } from "../../../../../presentation/protocols";
import { makeLogDecorator } from "../../../decorators/log-controller-decorator-factory";
import { makeDbLoadSurveys } from "../../../usecases/load-surveys/db-load-surveys-factory";


export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveyController(makeDbLoadSurveys())
  return makeLogDecorator(controller)
}