const EventEmitter = require('events')
const adb = require('adbkit')
const client = adb.createClient()

module.exports = class EventSourceAndroid extends EventEmitter {
  constructor () {
    super()
    const platform = 'Android'
    client.trackDevices()
      .then(tracker => {
        const forwardEvent = event => {
          tracker.on(event, device => {
            this.emit(event, {
              udid: device.id,
              platform
            })
          })
        }
        forwardEvent('add')
        forwardEvent('remove')
      })
  }
}
