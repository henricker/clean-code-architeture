import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/cripthography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import EmailValidatorAdapter from "../../utils/email-validator-adapter";


export const makeSignUpController = (): SignUpController => {
  const bcryptAdapter = new BcryptAdapter(12)
  const addAccountRepository = new AccountMongoRepository()
  const emailValidator = new EmailValidatorAdapter()
  const dbAddAccountUseCase = new DbAddAccount(bcryptAdapter, addAccountRepository)
  return new SignUpController(emailValidator,dbAddAccountUseCase)
}