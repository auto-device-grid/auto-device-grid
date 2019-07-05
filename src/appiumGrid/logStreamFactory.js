const path = require('path')
const fs = require('fs-extra')

module.exports = class LogStreamFactory {
  constructor (logPathRelativeToProjectRoot) {
    this.path = logPathRelativeToProjectRoot
  }

  createFilePath (pid) {
    const now = new Date()
    const timeStamp = `${now.getFullYear()}${now.getMonth()}${now.getDate()}-${now.getHours()}:${now.getMinutes()}`
    const filePath = path.join(
      __dirname.replace('src/appiumGrid', this.path),
      `${timeStamp}_${pid}_appium.log`
    )
    return filePath
  }

  async build (pid) {
    const filePath = this.createFilePath(pid)
    await fs.ensureFile(filePath)
    return fs.createWriteStream(filePath)
  }
}
