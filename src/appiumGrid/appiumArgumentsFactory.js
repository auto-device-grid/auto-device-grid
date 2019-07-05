const untildify = require('untildify')

const createAppiumOptions = (port, internalPort, nodeconfig, device) => {
  const returnObject = {
    port,
    nodeconfig
  }
  const defaultCapabilities = {
    udid: device.udid,
    platformName: device.platform
  }
  device.platform !== 'Android' ? defaultCapabilities.wdaLocalPort = internalPort : defaultCapabilities.systemPort = internalPort
  returnObject['default-capabilities'] = JSON.stringify(defaultCapabilities)
  return returnObject
}

const verifyAndGetAppiumArguments = (args, appiumConfig) => {
  if (!(
    args.hasOwnProperty('port') &&
    args.hasOwnProperty('nodeconfig')
  )) {
    throw new TypeError('Either port or nodeConfig arguments are not present')
  }
  const returnArgs = [untildify(appiumConfig.appiumPath)]
  for (const arg in args) {
    returnArgs.push(`--${arg}`)
    returnArgs.push(args[arg])
  }
  returnArgs.push('--relaxed-security')
  return returnArgs
}

module.exports = class AppiumArgumentsFactory {
  static build (appiumPort, operationsPort, nodeConfig, device, appiumConfig) {
    return verifyAndGetAppiumArguments(createAppiumOptions(appiumPort, operationsPort, nodeConfig, device), appiumConfig)
  }
}
