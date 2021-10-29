import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/domain/models/Account'

export interface AddAccountRepository {
  add(account: AddAccountParams): Promise<AccountModel>
}