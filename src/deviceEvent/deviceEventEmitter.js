const EventEmitter = require('events')

module.exports = class DeviceEventEmitter extends EventEmitter {
  addEventSource (eventEmitter, platform) {
    const addEvent = event => {
      eventEmitter.on(event, device => this.emit('change', {
        event,
        device
      }))
    }
    addEvent('add')
    addEvent('remove')
  }
}
