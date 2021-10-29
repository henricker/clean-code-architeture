import { AddAccountParams } from '@/domain/usecases/add-account'
import { AccountModel } from '@/domain/models/Account'

export interface AddAccountRepository {
  add(account: AddAccountParams): Promise<AccountModel>
}