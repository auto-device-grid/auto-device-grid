const { fromEvent } = require('rxjs')
const { buffer, debounceTime, map, flatMap } = require('rxjs/operators')

module.exports = function DeviceEventStream (eventEmitter) {
  const deviceEventStream = fromEvent(eventEmitter, 'change')
  return deviceEventStream.pipe(
    buffer(
      deviceEventStream.pipe(
        debounceTime(250)
      )
    ),
    map(array => {
      const events = {}
      array.forEach(event => {
        events[event.device.udid] = {
          count: 0,
          device: event.device
        }
      })
      array.forEach(event => {
        let v = 0
        if (event.event === 'add') {
          v = 1
        } else if (event.event === 'remove') {
          v = -1
        }
        events[event.device.udid].count += v
      })
      return Object.keys(events).reduce((result, key) => {
        if (events[key].count !== 0) {
          result.push({
            event: events[key].count > 0 ? 'add' : 'remove',
            device: events[key].device
          })
        }
        return result
      }, [])
    }),
    flatMap(x => x)
  )
}
