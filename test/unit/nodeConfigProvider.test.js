const nodeConfigProvider = require('../../src/appiumGrid/nodeConfigProvider')
const validGridConfig = require('../resources/config/grid.config.test.json')
const validAppiumConfig = require('../resources/config/appium.config.test.json')
const deviceDetails = {
  deviceName: 'test_device',
  platform: 'test_os',
  udid: 'test_udid'
}

const expectedConfig = {
  capabilities: [
    {
      deviceName: deviceDetails.deviceName,
      maxInstances: 1,
      platformName: deviceDetails.platform,
      udid: deviceDetails.udid
    }
  ],
  configuration:
  {
    cleanUpCycle: 2000,
    timeout: 30000,
    proxy: 'org.openqa.grid.selenium.proxy.DefaultRemoteProxy',
    url: 'http://127.0.0.1:4723/wd/hub',
    host: '127.0.0.1',
    port: 4723,
    maxSession: 1,
    register: true,
    registerCycle: 5000,
    hubPort: 4444,
    hubHost: '127.0.0.1'
  }
}

describe('nodeConfigProvider', function () {
  it('should validate nodeConfig for provided device id and ports', function () {
    const nodeConfig = nodeConfigProvider(deviceDetails, validAppiumConfig.ip, 4723, validGridConfig)
    expect(nodeConfig).to.deep.equal(expectedConfig)
  })

  it('should throw an error when deviceDetails are invalid', function () {
    const invalidDeviceDetails = {
      invalidValue: 'invalid'
    }
    expect(
      () => nodeConfigProvider(invalidDeviceDetails, validAppiumConfig.ip, 4723, validGridConfig)
    )
      .to.throw(TypeError, 'Either the deviceName or the device udid are undefined')
  })

  it('should throw an error when appiumPort is illegal', () => {
    expect(
      () => nodeConfigProvider(deviceDetails, validAppiumConfig.ip, 'wrong_port', validGridConfig)
    ).to.throw(TypeError, 'Either the grid port or the appium port are not a number')
  })

  it('should throw an error when gridPort is illegal', () => {
    const invalidGridConfig = {
      'ip': '127.0.0.1',
      'port': 'invalid_port',
      'cleanUpCycle': 2000,
      'timeout': 30000,
      'registerCycle': 5000
    }
    expect(
      () => nodeConfigProvider(deviceDetails, validAppiumConfig.ip, 4723, invalidGridConfig)
    ).to.throw(TypeError, 'Either the grid port or the appium port are not a number')
  })
})
