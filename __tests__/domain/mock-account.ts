import { AddAccountParams } from '../../src/domain/usecases/add-account'
import { AuthenticationParams } from '../../src/domain/usecases/authentication'
import { AccountModel } from '../../src/domain/models/Account'
import faker from 'faker'

export const mockAccountModel = (): AccountModel => ({
  id: faker.datatype.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})