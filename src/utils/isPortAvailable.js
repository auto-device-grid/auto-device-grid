const net = require('net')

module.exports = port => new Promise((resolve, reject) => {
  const server = net.createServer()
  server.unref()
  server.on('error', reject)
  server.listen(port, '0.0.0.0', () => {
    const actualPort = server.address().port
    server.close(() => {
      resolve(actualPort === port)
    })
  })
}).catch(error => {
  if (error.code === 'EADDRINUSE') {
    return false
  } else {
    throw error
  }
})
