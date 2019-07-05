const isPortAvailable = require('../../src/utils/isPortAvailable')
const getPort = require('get-port')
const net = require('net')

const startServer = port => new Promise((resolve, reject) => {
  const server = net.createServer()
  server.unref()
  server.on('error', reject)
  server.listen(port, '0.0.0.0', () => {
    resolve(server)
  })
})

const stopServer = server => new Promise((resolve, reject) => {
  server.close((error) => {
    if (error) {
      reject(error)
    } else {
      resolve()
    }
  })
})

describe('isPortAvailable', function () {
  it('should return false if I am using the port', async function () {
    const port = await getPort({ host: '0.0.0.0' })
    const server = await startServer(port)
    expect(await isPortAvailable(port)).to.be.false
    await stopServer(server)
  })

  it('should return true if the port is free', async function () {
    const port = await getPort({ host: '0.0.0.0' })
    expect(await isPortAvailable(port)).to.be.true
  })
})
