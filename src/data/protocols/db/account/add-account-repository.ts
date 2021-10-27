import { AddAccountModel } from '@/domain/usecases/add-account'
import { AccountModel } from '@/domain/models/Account'

export interface AddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel>
}