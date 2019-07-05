const DeviceEventEmitter = require('../../src/deviceEvent/deviceEventEmitter')
const EventEmitter = require('events')

describe('DeviceEventEmitter', function () {
  it('should convert add and remove events to change events', function () {
    const device1 = {
      udid: 'test-udid1',
      platform: 'iOS'
    }
    const device2 = {
      udid: 'test-udid2',
      platform: 'Android'
    }
    const device3 = {
      udid: 'test-udid3',
      platform: 'Chrome'
    }
    const deviceEventEmitter = new DeviceEventEmitter()
    const eventEmitter = new EventEmitter()
    deviceEventEmitter.addEventSource(eventEmitter)
    const spy = sinon.spy()
    deviceEventEmitter.on('change', spy)
    eventEmitter.emit('add', device1)
    eventEmitter.emit('remove', device2)
    eventEmitter.emit('add', device3)
    expect(spy).to.have.been.calledThrice
    expect(spy.firstCall).to.have.been.calledWith({
      event: 'add',
      device: device1
    })
    expect(spy.secondCall).to.have.been.calledWith({
      event: 'remove',
      device: device2
    })
    expect(spy.thirdCall).to.have.been.calledWith({
      event: 'add',
      device: device3
    })
  })
})
