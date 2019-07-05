const path = require('path')

const LogStreamFactory = require('../../src/appiumGrid/logStreamFactory')

const projectRoot = path.join(__dirname, '../..')

describe('LogStreamFactory', function () {
  it('should generate path relative to the project root', function () {
    const logDirectory = 'test/directory'
    const logStreamFactory = new LogStreamFactory(logDirectory)
    const actualLogDirectory = path.dirname(logStreamFactory.createFilePath(1))
    const expectedLogDirectory = path.join(projectRoot, logDirectory)
    expect(actualLogDirectory).to.equal(expectedLogDirectory)
  })

  it('should hanlde any combination of trailing and leading /', function () {
    const logDirectories = [
      'test/directory',
      '/test/directory',
      'test/directory/',
      '/test/directory/'
    ]
    const filePaths = logDirectories.map(path =>
      new LogStreamFactory(path).createFilePath(1)
    )
    expect(filePaths).to.all.equal(filePaths[0])
    // Would be nice if I could do something like the below:
    // expect(filePaths).to.all.be.same
  })
})
