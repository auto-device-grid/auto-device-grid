const http = require('http')
const untildify = require('untildify')

const AppiumArgumentsFactory = require('./appiumArgumentsFactory')
const LogStreamFactory = require('./logStreamFactory')

module.exports = class AppiumManager {
  constructor (
    appiumPort,
    operationsPort,
    nodeConfig,
    device,
    appiumConfig = require('../../config/appium.config.json'),
    ProcessManager = require('./processManager')
  ) {
    this.appiumPort = appiumPort
    this.operationsPort = operationsPort
    this.nodeConfig = nodeConfig
    this.device = device
    this.appiumConfig = appiumConfig

    const command = untildify(appiumConfig.nodePath)
    const args = AppiumArgumentsFactory.build(appiumPort, operationsPort, nodeConfig, device, appiumConfig)
    const validatorFunction = () => new Promise((resolve, reject) => {
      http.get(`http://${appiumConfig.ip}:${appiumPort}/wd/hub/status`, resp => {
        resp.on('data', chunk => resolve(chunk.toString()))
        resp.on('error', err => reject(err))
      })
    })
    const logStreamFactory = new LogStreamFactory('logs/appium')
    this.processManager = new ProcessManager(
      command,
      args,
      validatorFunction,
      logStreamFactory
    )
  }

  async startServer () {
    this.appiumProcess = await this.processManager.startProcess()
  }

  isItRunning () {
    return typeof process.pid !== 'undefined'
  }

  async stopAppiumServer () {
    this.processManager.stopProcess()
    setTimeout(
      () => this.processManager.hardKillProcess(),
      3000
    )
  }
}
