module.exports = class PortManager {
  constructor (isPortAvailable = require('../utils/isPortAvailable'), usedPorts = {}) {
    this.isPortAvailable = isPortAvailable
    this.usedPorts = usedPorts
  }

  async isPortUsed (port) {
    return (this.usedPorts[port] || (this.usedPorts[port] = !await this.isPortAvailable(port)))
  }

  async getPort (port) {
    while (await this.isPortUsed(port)) {
      port++
    }
    this.usedPorts[port] = true
    return port
  }

  releasePort (port) {
    this.usedPorts[port] = false
  }
}
