const PortManager = require('./portManager')

const nodeConfigProvider = require('./nodeConfigProvider')
const NodeFileGenerator = require('./nodeConfigFileGenerator')
const AppiumManager = require('./appiumManager')

module.exports = class GridManager {
  constructor (
    appiumConfig = require('../../config/appium.config.json'),
    gridConfig = require('../../config/grid.config.json'),
    portManager = new PortManager()
  ) {
    this.appiumConfig = appiumConfig
    this.gridConfig = gridConfig
    this.nodeFileGenerator = new NodeFileGenerator()
    this.appiumProcessDictionary = {}
    this.portManager = portManager
  }

  async addToGrid (device) {
    const appiumPort = await this.portManager.getPort(4723)
    const operationsPort = await this.portManager.getPort(8100)
    const nodeFilePath = await this.nodeFileGenerator.createNodeConfigFile(
      nodeConfigProvider(device, this.appiumConfig.ip, appiumPort, this.gridConfig),
      device.udid
    )
    this.appiumProcessDictionary[device.udid] = new AppiumManager(appiumPort, operationsPort, nodeFilePath, device)
    await this.appiumProcessDictionary[device.udid].startServer()
  }

  async removeFromGrid (device) {
    const appiumManager = this.appiumProcessDictionary[device.udid]
    if (appiumManager.isItRunning()) {
      await appiumManager.stopAppiumServer()
    }
    this.portManager.releasePort(appiumManager.appiumPort)
    this.portManager.releasePort(appiumManager.operationsPort)
    delete this.appiumProcessDictionary[device.udid]
  }
}
