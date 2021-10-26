import { 
  AccountModel, 
  AddAccount, 
  AddAccountModel, 
  AddAccountRepository, 
  Hasher, 
  LoadAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {

  constructor(
    private readonly hasher: Hasher, 
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAcccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    await this.loadAcccountByEmailRepository.loadByEmail(accountData.email)
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return account
  }
  
}