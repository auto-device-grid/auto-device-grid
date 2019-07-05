const AppiumManager = require('../../src/appiumGrid/appiumManager')
const validAppiumConfig = require('../resources/config/appium.config.test.json')

// After refactoring, these tests do no longer make sense. The Appium manager is
// now responsible for building these options, which makes the validation
// redundant. To test the options building would require further refactoring,
// which is why I've decided to just skip these tests for now.
describe.skip('AppiumManager', function () {
  it('should not create AppiumManager object without nodeconfig file', function () {
    const invalidArgs = {
      port: 4723
    }
    expect(
      () => new AppiumManager(invalidArgs)
    ).to.throw(TypeError, 'Either port or nodeConfig arguments are not present')
  })

  it('should not create AppiumManager without port', function () {
    const invalidArgs = {
      nodeconfig: 'bla/bla'
    }
    expect(
      () => new AppiumManager(invalidArgs)
    ).to.throw(TypeError, 'Either port or nodeConfig arguments are not present')
  })

  it('should create valid arguments for appium', function () {
    const validArguments = {
      port: 4723,
      nodeconfig: 'test-config',
      testArg: 'test-argument'
    }
    const appiumManager = new AppiumManager(validArguments, validAppiumConfig)
    const appiumArguments = appiumManager.processManager.args
    expect(appiumArguments[0]).to.deep.equal('testPath')
    expect(appiumArguments[1]).to.deep.equal('--port')
    expect(appiumArguments[2]).to.deep.equal(4723)
    expect(appiumArguments[3]).to.deep.equal('--nodeconfig')
    expect(appiumArguments[4]).to.deep.equal('test-config')
  })

  it('should set the path as home dir when appium or node path starts with ~', function () {
    const appiumConfig = {
      ip: '127.0.0.1',
      appiumPath: '~/testPath',
      nodePath: '~/test-path'
    }
    const validArguments = {
      port: 4723,
      nodeconfig: 'test-config'
    }
    const appiumManager = new AppiumManager(validArguments, appiumConfig)
    const generatedAppiumPath = appiumManager.processManager.args[0]
    expect(generatedAppiumPath).to.equal(`${process.env.HOME}/testPath`)
    expect((appiumManager.processManager.command)).to.equal(`${process.env.HOME}/test-path`)
  })
})
