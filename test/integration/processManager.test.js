const path = require('path')
const fs = require('fs-extra')

const ProcessManager = require('../../src/appiumGrid/processManager')

describe('ProcessManger', function () {
  beforeEach(function () {
    this.logFilePath = '/dev/null'
    this.logStreamFactory = {
      build: async () => {
        await fs.ensureFile(this.logFilePath)
        return fs.createWriteStream(this.logFilePath)
      }
    }
    this.processValidator = () => Promise.resolve(true)
    this.clock = sinon.useFakeTimers()
    this.tick = async ms => {
      this.clock.tick(ms)
    }
    this.processManager = new ProcessManager(
      'sh',
      [path.resolve(__dirname, '../resources/process.test.sh')],
      this.processValidator,
      this.logFile,
      500
    )
  })
  afterEach(async function () {
    this.clock.restore()
  })

  it('should create log file for stdouts if logFilePath is given', async function () {
    this.processManager.process = {
      pid: 1000
    }
    await this.processManager.createLogStream()
    const isResolved = await fs.access(this.logFilePath)
    expect(isResolved).to.be.undefined
  })

  it('should stream logs to stdout if no logFilePath is given', async function () {
    const processValidator = () => Promise.resolve(true)
    this.processManager = new ProcessManager(
      'sh', [path.resolve(__dirname, '../resources/process.test.sh')], processValidator
    )
    this.processManager.process = {
      pid: 1000
    }
    await this.processManager.createLogStream()
    expect(this.processManager.logStream).to.equal(process.stdout)
  })

  it('should kill process on stopProcess', async function () {
    this.processManager.startProcess()
    this.tick(500)
    this.processManager.stopProcess()
    expect(this.processManager.process.killed).to.be.true
  })

  it('should kill process on hard kill', async function () {
    this.processManager.startProcess()
    this.tick(500)
    this.processManager.hardKillProcess()
    expect(this.processManager.process.killed).to.be.true
  })

  it('should call processValidator function after the timeout', async function () {
    const processValidator = sinon.spy(() => Promise.resolve(true))
    this.processManager = new ProcessManager(
      'sh',
      [path.resolve(__dirname, '../resources/process.test.sh')],
      processValidator,
      this.logFile, 500
    )
    this.processManager.startProcess()
    this.tick(500)
    expect(processValidator).to.have.been.calledOnce
  })

  it('should throw an exception if processValidator resolves false', async function () {
    this.processManager = new ProcessManager(
      'sh',
      [path.resolve(__dirname, '../resources/process.test.sh')],
      () => Promise.resolve(false),
      this.logFile, 500
    )
    await Promise.all([
      this.processManager.startProcess()
        .catch(error => expect(error.message).to.equal('Process failed to start within timeout')),
      this.tick(500)
    ])
  })

  it('should throw an exception if processValidator rejects the promise', async function () {
    this.processManager = new ProcessManager(
      'sh',
      [path.resolve(__dirname, '../resources/process.test.sh')],
      () => Promise.reject(new Error('test')),
      this.logFile, 500
    )
    await Promise.all([
      this.processManager.startProcess()
        .catch(error => expect(error.message).to.equal('test')),
      this.tick(500)
    ])
  })
})
