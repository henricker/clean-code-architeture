import { Hasher } from "../../../data/protocols/criptography/hasher";
import brcrypt from 'bcrypt'
import { HashComparer } from "../../../data/protocols/criptography/hash-comparer";

export class BcryptAdapter implements Hasher, HashComparer {

  constructor(private readonly salt: number) {}
  
  async hash(value: string): Promise<string> {
    const hashedValue = await brcrypt.hash(value, this.salt)
    return hashedValue
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await brcrypt.compare(value, hash)
    return isValid
  }

}