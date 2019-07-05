const DeviceEventHandler = require('../../src/deviceEvent/deviceEventHandler')

const createEvent = event => ({
  event,
  device: {
    udid: 'test-udid',
    platform: 'iOS'
  }
})

const waitFor = ms => () => new Promise(resolve => {
  setTimeout(resolve, ms)
})

describe('DeviceEventHandler', function () {
  beforeEach(function () {
    this.clock = sinon.useFakeTimers()
    this.tick = async ms => {
      this.clock.tick(ms)
    }
  })
  afterEach(function () {
    this.clock.restore()
  })

  it('should send add events to add handler', async function () {
    const event = createEvent('add')
    const addHandler = sinon.spy()
    const removeHandler = sinon.spy()
    const deviceEventHandler = new DeviceEventHandler(
      addHandler,
      removeHandler
    )
    await deviceEventHandler.handle(event)
    expect(addHandler).to.have.been.calledOnce
    expect(addHandler).to.have.been.calledWith(event)
    expect(removeHandler).to.not.have.been.called
  })

  it('should send remove events to remove handler', async function () {
    const event = createEvent('remove')
    const addHandler = sinon.spy()
    const removeHandler = sinon.spy()
    const deviceEventHandler = new DeviceEventHandler(
      addHandler,
      removeHandler
    )
    await deviceEventHandler.handle(event)
    expect(removeHandler).to.have.been.calledOnce
    expect(removeHandler).to.have.been.calledWith(event)
    expect(addHandler).to.not.have.been.called
  })

  it('should not handle remove event for same device until add event has finished', async function () {
    const addEvent = createEvent('add')
    const removeEvent = createEvent('remove')
    const addHandler = sinon.spy(waitFor(2000)) // Simulating that adding device takes 2 seconds
    const removeHandler = sinon.spy(waitFor(1000)) // and removing takes 1 second
    const deviceEventHandler = new DeviceEventHandler(
      addHandler,
      removeHandler
    )
    deviceEventHandler.handle(addEvent)
    deviceEventHandler.handle(removeEvent)
    await this.tick(100)
    expect(addHandler).to.have.been.calledOnce
    expect(addHandler).to.have.been.calledWith(addEvent)
    expect(removeHandler).to.not.have.been.called
    await this.tick(2000)
    expect(removeHandler).to.have.been.calledOnce
    expect(removeHandler).to.have.been.calledWith(removeEvent)
    await this.tick(2000)
  })
})
