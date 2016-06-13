const path = require('path')
const httpServer = require('http-server')
const server = httpServer.createServer({
  root: path.resolve(__dirname, '../../')
})

server.listen(8080)

const spawn = require('cross-spawn')
const args = [
  '--config', 'config/nightwatch.conf.js',
  '--env', 'chrome,firefox'
]

if (process.argv[2]) {
  args.push('--test', 'test/e2e/test/' + process.argv[2])
}

const runner = spawn('./node_modules/.bin/nightwatch', args, {
  stdio: 'inherit'
})

runner.on('exit', code => {
  server.close()
  process.exit(code)
})

runner.on('error', err => {
  server.close()
  throw err
})
