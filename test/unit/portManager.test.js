const PortManager = require('../../src/appiumGrid/portManager')

describe('PortManager', function () {
  it('should return the requested port if it hasn\'t been requested before', async function () {
    const portManager = new PortManager(() => Promise.resolve(true))
    const port = await portManager.getPort(4723)
    expect(port).to.equal(4723)
  })

  it('should return the next port if the requested port is already in use', async function () {
    const portManager = new PortManager(() => Promise.resolve(true))
    const port1 = await portManager.getPort(4723)
    const port2 = await portManager.getPort(4723)
    expect(port1).to.equal(4723)
    expect(port2).to.equal(4724)
  })

  it('should return the next port if the requested port is in used by another process', async function () {
    const portManager = new PortManager(port => Promise.resolve(port !== 4723))
    const port = await portManager.getPort(4723)
    expect(port).to.equal(4724)
  })

  it('should return the next available port regardless of whether the port is used by us or someone else', async function () {
    const portManager = new PortManager(port => Promise.resolve(port !== 4723))
    const port1 = await portManager.getPort(4723)
    const port2 = await portManager.getPort(4723)
    expect(port1).to.equal(4724)
    expect(port2).to.equal(4725)
  })

  it('should not check if the same port is available more than once', async function () {
    const isPortAvailable = sinon.spy(port => Promise.resolve(port !== 4723))
    const portManager = new PortManager(isPortAvailable)
    const port1 = await portManager.getPort(4723)
    const port2 = await portManager.getPort(4723)
    expect(port1).to.equal(4724)
    expect(port2).to.equal(4725)
    expect(isPortAvailable).to.have.been.calledThrice
  })

  it('should return the same port again if it has been released by us', async function () {
    const portManager = new PortManager(() => Promise.resolve(true))
    const port1 = await portManager.getPort(4723)
    portManager.releasePort(port1)
    const port2 = await portManager.getPort(4723)
    expect(port1).to.equal(4723)
    expect(port2).to.equal(4723)
  })
})
