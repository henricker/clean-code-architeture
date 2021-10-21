import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/cripthography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { Controller } from "../../presentation/protocols";
import EmailValidatorAdapter from "../../utils/email-validator-adapter";
import { LogControllerDecorator } from "../decorators/log";


export const makeSignUpController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter(12)
  const addAccountRepository = new AccountMongoRepository()
  const emailValidator = new EmailValidatorAdapter()
  const dbAddAccountUseCase = new DbAddAccount(bcryptAdapter, addAccountRepository)
  const signUpController = new SignUpController(emailValidator, dbAddAccountUseCase)
  const logControllerDecorator = new LogControllerDecorator(signUpController)
  return logControllerDecorator
}