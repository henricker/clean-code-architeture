import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { LogMongoRepository } from "../../../data/usecases/log-repository/log";
import { BcryptAdapter } from "../../../infra/cripthography/bcrypt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../../presentation/controllers/signup/signup";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorators/log";
import { makeSignUpValidation } from "./signup-validation-factory";


export const makeSignUpController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter(12)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccountUseCase = new DbAddAccount(bcryptAdapter, addAccountRepository)
  const signUpController = new SignUpController(dbAddAccountUseCase, makeSignUpValidation())
  const logMongoRepository = new LogMongoRepository()
  const logControllerDecorator = new LogControllerDecorator(signUpController, logMongoRepository)
  return logControllerDecorator
}