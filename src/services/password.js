const { scrypt, randomBytes } = require('crypto')
const { promisify } = require('util')

const scryptAsync = promisify(scrypt)

module.exports = class Password {
  static async toHash(password) {
    // 8 bytes in hex string
    const salt = randomBytes(8).toString('hex')

    const buf = await scryptAsync(password, salt, 64)

    return `${buf.toString('hex')}.${salt}`
  }

  static async compare(storedPassword, suppliedPassword) {
    const [hash, salt] = storedPassword.split('.')

    const buf = await scryptAsync(suppliedPassword, salt, 64)

    return buf.toString('hex') === hash
  }
}
