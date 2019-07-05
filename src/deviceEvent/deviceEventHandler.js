module.exports = class DeviceEventHandler {
  constructor (addHandler, removeHandler) {
    this.addHandler = addHandler
    this.removeHandler = removeHandler
    this.eventsCurrentlyBeingHandled = {}
  }

  handle (event) {
    const udid = event.device.udid
    let promise = this.increment(udid)
    if (event.event === 'add') {
      promise = promise.then(() => this.addHandler(event))
    } else if (event.event === 'remove') {
      promise = promise.then(() => this.removeHandler(event))
    }
    promise = promise.then(() => this.decrement(udid))
    this.eventsCurrentlyBeingHandled[udid].promise = promise
    return promise
  }

  increment (udid) {
    if (this.eventsCurrentlyBeingHandled[udid] === undefined) {
      this.eventsCurrentlyBeingHandled[udid] = {
        counter: 0,
        promise: Promise.resolve()
      }
    }
    this.eventsCurrentlyBeingHandled[udid].counter++
    return this.eventsCurrentlyBeingHandled[udid].promise
  }

  decrement (udid) {
    this.eventsCurrentlyBeingHandled[udid].counter--
    if (this.eventsCurrentlyBeingHandled[udid].counter === 0) {
      this.eventsCurrentlyBeingHandled[udid] = undefined
    }
  }
}
