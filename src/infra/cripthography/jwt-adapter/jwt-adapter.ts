import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  
  constructor(private readonly secretKey: string) {}

  async sign(value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secretKey)
    return accessToken 
  }

  async verify(token: string): Promise<string> {
    const value =  await jwt.verify(token, this.secretKey)
    return value['id']
  }
}