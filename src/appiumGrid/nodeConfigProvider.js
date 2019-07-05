module.exports = function generateConfig (deviceDetails, appiumIP, appiumPort, gridConfig) {
  if (!(deviceDetails.deviceName || deviceDetails.udid)) {
    throw new TypeError('Either the deviceName or the device udid are undefined')
  }
  const isArgumentInvalid = [appiumPort, gridConfig.port]
    .some(configValue => isNaN(configValue))
  if (isArgumentInvalid) {
    throw new TypeError('Either the grid port or the appium port are not a number')
  }
  return {
    capabilities: [
      {
        'deviceName': deviceDetails.deviceName,
        'maxInstances': 1,
        'platformName': deviceDetails.platform,
        'udid': deviceDetails.udid
      }
    ],
    'configuration':
    {
      'cleanUpCycle': gridConfig.cleanUpCycle,
      'timeout': gridConfig.timeout,
      'proxy': 'org.openqa.grid.selenium.proxy.DefaultRemoteProxy',
      'url': `http://${appiumIP}:${appiumPort}/wd/hub`,
      'host': appiumIP,
      'port': appiumPort,
      'maxSession': 1,
      'register': true,
      'registerCycle': gridConfig.registerCycle,
      'hubPort': gridConfig.port,
      'hubHost': gridConfig.ip
    }
  }
}
