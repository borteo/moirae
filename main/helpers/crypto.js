require('dotenv').config()
import SimpleCrypto from 'simple-crypto-js'

const simpleCrypto = new SimpleCrypto(process.env.SECRET_KEY)

// content can be a string, buffer, array, etc.
export const encrypt = (content) => {
  const cipherContent = simpleCrypto.encrypt(content)

  // console.log('Encrypted message:', cipherContent)
  return cipherContent
}

export const decrypt = (content) => {
  const decipherText = simpleCrypto.decrypt(content)

  // console.log('Dencrypted message:', decipherText)
  return decipherText
}
