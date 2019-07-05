const fs = require('fs-extra')
const path = require('path')

class NodeFileGenerator {
  constructor (folderPath = __dirname.replace('/src', '/tmp/nodeConfigs')) {
    this.folderPath = folderPath
  }

  async createNodeConfigFile (nodeConfig, udid) {
    const nodeCOnfigFilePath = path.join(this.folderPath, `${udid}.json`)
    await fs.ensureFile(nodeCOnfigFilePath)
    await fs.writeJSON(nodeCOnfigFilePath, nodeConfig)
    return nodeCOnfigFilePath
  }

  async deleteNodeConfigFile (udid) {
    await fs.remove(path.join(this.folderPath, `${udid}.json`))
  }
}

module.exports = NodeFileGenerator
