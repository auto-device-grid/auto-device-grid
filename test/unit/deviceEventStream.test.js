const DeviceEventStream = require('../../src/deviceEvent/deviceEventStream')
const EventEmitter = require('events')

describe('DeviceEventStream', function () {
  beforeEach(function () {
    this.clock = sinon.useFakeTimers()
    this.eventEmitter = new EventEmitter()
    this.emit = (event, device) => {
      this.eventEmitter.emit('change', {
        event,
        device
      })
    }
  })
  afterEach(function () {
    this.clock.restore()
  })

  it('should filter matching add and remove events sent in quick succession', function () {
    const device = {
      udid: 'test-udid'
    }
    const eventStream = new DeviceEventStream(this.eventEmitter)
    const spy = sinon.spy()
    eventStream.subscribe(spy)
    this.emit('add', device)
    this.emit('remove', device)
    this.emit('add', device)
    this.clock.tick(500)
    expect(spy).to.have.been.calledOnce
    expect(spy).to.have.been.calledWith({
      event: 'add',
      device: {
        udid: 'test-udid'
      }
    })
  })

  it('should not filter mismatching add and remove events sent in quick succession', function () {
    const device1 = {
      udid: 'test-udid1'
    }
    const device2 = {
      udid: 'test-udid2'
    }
    const device3 = {
      udid: 'test-udid3'
    }
    const eventStream = new DeviceEventStream(this.eventEmitter)
    const spy = sinon.spy()
    eventStream.subscribe(spy)
    this.emit('add', device1)
    this.emit('remove', device2)
    this.emit('add', device3)
    this.clock.tick(500)
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

  it('should not emit an event if a device was added and removed in quick succession', function () {
    const device = {
      udid: 'test-udid'
    }
    const eventStream = new DeviceEventStream(this.eventEmitter)
    const spy = sinon.spy()
    eventStream.subscribe(spy)
    this.emit('add', device)
    this.emit('remove', device)
    this.clock.tick(500)
    expect(spy).to.not.have.been.called
  })

  it('should not emit an event until it has been 250 ms since the last incoming event', function () {
    const device = {
      udid: 'test-udid'
    }
    const eventStream = new DeviceEventStream(this.eventEmitter)
    const spy = sinon.spy()
    eventStream.subscribe(spy)
    this.emit('add', device)
    this.clock.tick(100)
    this.emit('remove', device)
    this.clock.tick(100)
    this.emit('add', device)
    this.clock.tick(100)
    this.emit('remove', device)
    this.clock.tick(100)
    this.emit('add', device)
    expect(spy).to.not.have.been.called
    this.clock.tick(500)
    expect(spy).to.have.been.calledOnce
    expect(spy).to.have.been.calledWith({
      event: 'add',
      device: {
        udid: 'test-udid'
      }
    })
  })
})
