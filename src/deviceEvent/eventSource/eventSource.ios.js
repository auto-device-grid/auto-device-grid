const usb = require('usb-detection')
const EventEmitter = require('events')

module.exports = class EventSourceIos extends EventEmitter {
  constructor () {
    super()
    const vid = 1452 // Apple
    const pids = [ 4776, 4779 ] // iPhone and iPad (in that order)
    const platform = 'iOS'
    usb.find()
      .then(devices => {
        devices
          .filter(device => pids.includes(device.productId))
          .forEach(device => {
            this.emit('add', {
              udid: device.serialNumber,
              platform
            })
          })
        usb.startMonitoring()
        const forwardEvent = event => {
          pids.forEach(pid => {
            usb.on(`${event}:${vid}:${pid}`, device => {
              this.emit(event, {
                udid: device.serialNumber,
                platform
              })
            })
          })
        }
        forwardEvent('add')
        forwardEvent('remove')
      })
      .catch(err => {
        console.log(err)
      })
  }
}
