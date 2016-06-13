const zlib = require('zlib')
const rollup = require('rollup')
const uglify = require('uglify-js')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const pack = require('../package.json')
const banner = require('./banner')
const fs = require('fs')
const readFile = fs.readFileSync
const writeFile = fs.writeFileSync
const exist = fs.existsSync
const mkdir = fs.mkdirSync

if (!exist('dist')) {
  mkdir('dist')
}

// update main file
const main = readFile('src/index.js', 'utf-8')
  .replace(/plugin\.version = '[\d\.]+'/, `plugin.version = '${pack.version}'`)
writeFile('src/index.js', main)

// CommonJS build.
// this is used as the "main" field in package.json
// and used by bundlers like Webpack and Browserify.
rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    babel()
  ]
}).then(bundle => {
  return write(
    `dist/${pack.name}.common.js`,
    bundle.generate({ format: 'cjs', banner }).code
  )
}).then(() => { // Standalone Dev Build
  return rollup.rollup({
    entry: 'src/index.js',
    plugins: [
      replace({ 'process.env.NODE_ENV': "'development'" }),
      babel()
    ]
  }).then(bundle => {
    return write(
      `dist/${pack.name}.js`,
      bundle.generate({
        format: 'umd', banner, moduleName: classify(pack.name)
      }).code
    )
  })
}).then(() => { // Standalone Production Build
  return rollup.rollup({
    entry: 'src/index.js',
    plugins: [
      replace({ 'process.env.NODE_ENV': "'production'" }),
      babel()
    ]
  }).then(bundle => {
    const code = bundle.generate({
      format: 'umd',
      moduleName: classify(pack.name)
    }).code
    const minified = banner + '\n' + uglify.minify(code, {
      fromString: true
    }).code
    return write(`dist/${pack.name}.min.js`, minified)
  }).then(zip)
}).catch(logError)

function toUpper (_, c) { return c ? c.toUpperCase() : '' }

const classifyRE = /(?:^|[-_\/])(\w)/g
function classify (str) { return str.replace(classifyRE, toUpper) }

function write (dest, code) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, code, err => {
      if (err) { return reject(err) }
      console.log(blue(dest) + ' ' + getSize(code))
      resolve()
    })
  })
}

function zip () {
  return new Promise((resolve, reject) => {
    fs.readFile(`dist/${pack.name}.min.js`, (err, buf) => {
      if (err) { return reject(err) }
      zlib.gzip(buf, (err, buf) => {
        if (err) { return reject(err) }
        write(`dist/${pack.name}.min.js.gz`, buf).then(resolve)
      })
    })
  })
}

function getSize (code) { return (code.length / 1024).toFixed(2) + 'kb' }

function logError (e) { console.log(e) }

function blue (str) { return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m' }
