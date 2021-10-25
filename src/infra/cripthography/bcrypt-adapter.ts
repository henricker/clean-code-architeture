import { Hasher } from "../../data/protocols/criptography/hasher";
import brcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher {

  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hashedValue = await brcrypt.hash(value, this.salt)
    return hashedValue
  }
}