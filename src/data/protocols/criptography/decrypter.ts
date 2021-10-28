export interface Decrypter {
  verify(value: string): Promise<string>
}