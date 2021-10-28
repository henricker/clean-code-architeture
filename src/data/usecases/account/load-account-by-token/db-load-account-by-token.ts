import { 
  Decrypter,
  AccountModel, 
  LoadAccountByTokenRepository, 
  LoadAccountByToken 
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {

  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const decripted = await this.decrypter.verify(accessToken)

    if(!decripted)
      return null

    const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    
    if(!account)
      return null

    return account
  }
}