import { 
  AccountModel, 
  AddAccount, 
  AddAccountParams, 
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

  async add(accountData: AddAccountParams): Promise<AccountModel> {
    const accountExists = await this.loadAcccountByEmailRepository.loadByEmail(accountData.email)
    
    if(accountExists)
      return null

    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return account
  }
  
}