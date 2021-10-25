import { Encrypter } from "../../data/protocols/criptography/encrypter";
import brcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {

  constructor(private readonly salt: number) {}

  async encrypt(value: string): Promise<string> {
    const hashedValue = await brcrypt.hash(value, this.salt)
    return hashedValue
  }
}