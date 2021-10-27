export interface Encrypter {
  sign(value: string): Promise<string>
}