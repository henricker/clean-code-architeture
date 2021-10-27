import env from '@/main/config/env'
import { DbLoadAccountByToken } from '@/data/usecases/load-account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { JwtAdapter } from '@/infra/cripthography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'


export const makeLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.secret)
  const accountMongoRepository = new AccountMongoRepository()
  const dbLoadAccountByToken = new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
  return dbLoadAccountByToken
}