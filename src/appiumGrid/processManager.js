const { spawn } = require('child_process')

module.exports = class ProcessManager {
  constructor (command, args, processValidator, logStreamFactory = { build: () => process.stdout }, processStartTimeout = 30000) {
    this.command = command
    this.args = args
    this.processValidator = processValidator
    this.logStreamFactory = logStreamFactory
    this.processStartTimeout = processStartTimeout
  }

  async createLogStream () {
    this.logStream = await this.logStreamFactory.build(this.process.pid)
  }

  async verifyProcess (exitCode) {
    let returnVal = (exitCode === null && this.process.pid)
    if (this.processValidator && typeof this.processValidator === 'function') {
      returnVal = await this.processValidator()
    }
    return returnVal
  }

  async startProcess () {
    return new Promise((resolve, reject) => {
      this.process = spawn(this.command, this.args)
      this.createLogStream().then(() => {
        this.process.stdout.pipe(this.logStream)
        this.process.stderr.pipe(this.logStream)
      })
      let exitCode = null
      const exitCallback = code => {
        exitCode = code
        reject(new Error(`Process exited before timeout with exit code ${code}`))
      }
      setTimeout(() => {
        this.process.removeListener('exit', exitCallback)
        this.verifyProcess(exitCode)
          .then(isRunning => isRunning ? resolve(this.process) : reject(new Error('Process failed to start within timeout')))
          .catch(err => reject(err))
      }, this.processStartTimeout)
      this.process.on('exit', exitCallback)
    })
  }

  stopProcess () {
    if (this.process !== undefined && !this.process.killed) {
      this.process.kill('SIGINT')
    }
  }

  hardKillProcess () {
    if (this.process !== undefined && !this.process.killed) {
      this.process.kill(9)
    }
  }
}
