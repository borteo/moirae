require('dotenv').config()
const fs = require('fs-extra')
const os = require('os')
const SimpleCrypto = require('simple-crypto-js').default

// const HOME = os.homedir()
const dirName = `./entries/2020`
const backupDir = `${dirName}-original`
const simpleCrypto = new SimpleCrypto(process.env.SECRET_KEY)

// create backup folder if not available
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir)
}

try {
  fs.copySync(dirName, backupDir)
  console.log(`Files copied to ${backupDir}.`)
} catch (err) {
  console.error('error when copying the folder content', error)
}

const files = fs
  .readdirSync(dirName)
  .map((file) => {
    const filePath = `${dirName}/${file}`
    const data = fs.readFileSync(filePath, 'utf8')
    const decipherContent = simpleCrypto.encrypt(data)

    fs.writeFileSync(filePath, decipherContent)
    console.log(`File ${filePath} encrypted.`)
  })
  .filter((file) => {
    return file.extension === 'md'
  })

console.log('=== DONE ===')
