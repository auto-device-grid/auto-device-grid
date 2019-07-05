const { from } = require('rxjs')
const { mergeMap } = require('rxjs/operators')

const EventSourceAndroid = require('./deviceEvent/eventSource/eventSource.android')
const EventSourceIos = require('./deviceEvent/eventSource/eventSource.ios')
const DeviceEventEmitter = require('./deviceEvent/deviceEventEmitter')
const DeviceEventStream = require('./deviceEvent/deviceEventStream')
const DeviceEventHandler = require('./deviceEvent/deviceEventHandler')
const GridManager = require('./appiumGrid/gridManager')

const deviceEventEmitter = new DeviceEventEmitter()
const deviceEventStream = new DeviceEventStream(deviceEventEmitter)
const gridManager = new GridManager()

const addHandler = async event => {
  await gridManager.addToGrid(event.device)
  console.log(`Added ${event.device.udid}`)
}

const removeHandler = async event => {
  await gridManager.removeFromGrid(event.device)
  console.log(`Removed ${event.device.udid}`)
}

const deviceEventHandler = new DeviceEventHandler(addHandler, removeHandler)
deviceEventStream.pipe(mergeMap(e => from(deviceEventHandler.handle(e)))).subscribe()

deviceEventEmitter.addEventSource(new EventSourceAndroid())
deviceEventEmitter.addEventSource(new EventSourceIos())
