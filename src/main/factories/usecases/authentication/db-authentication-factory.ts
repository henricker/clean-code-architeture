import env from '@/main/config/env'
import { DbAuthentication } from '@/data/usecases/db-authentication/db-authentication'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '@/infra/cripthography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cripthography/jwt-adapter/jwt-adapter'
import { Authentication } from '@/domain/usecases/authentication'

export const makeAuthentication = (): Authentication => {
  const hasherCompare = new BcryptAdapter(12)
  const jwtAdapter = new JwtAdapter(env.secret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(accountMongoRepository, hasherCompare, jwtAdapter, accountMongoRepository)
}