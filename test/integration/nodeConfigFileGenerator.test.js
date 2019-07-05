const fs = require('fs-extra')
const path = require('path')

const NodeConfigFileGenerator = require('../../src/appiumGrid/nodeConfigFileGenerator')

const config = {
  test: 'test'
}

describe('NodeConfigFileGenerator', function () {
  it('should create nodeConfig file in tmp directory', async function () {
    const nodeConfigFileGenerator = new NodeConfigFileGenerator(path.join(__dirname, '/tmp'))
    const filePath = await nodeConfigFileGenerator.createNodeConfigFile(config, 'udid')
    const fileContent = await fs.readJSON(filePath)
    expect(fileContent).to.deep.equal(config)
    await fs.remove(nodeConfigFileGenerator.folderPath)
  })
})
