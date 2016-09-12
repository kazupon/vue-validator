const fs = require('fs')
const readFile = fs.readFileSync
const writeFile = fs.writeFileSync
const exist = fs.existsSync
const mkdir = fs.mkdirSync
const pack = require('../package.json')
const getAllEntries = require('./entry').getAllEntries
const build = require('./bundle')

if (!exist('dist')) {
  mkdir('dist')
}

// update main file
const main = readFile('src/index.js', 'utf-8')
  .replace(/plugin\.version = '[\d\.]+'/, `plugin.version = '${pack.version}'`)
writeFile('src/index.js', main)

let entries = getAllEntries()

// filter entries via command line arg
if (process.argv[2]) {
  const filters = process.argv[2].split(',')
  entries = entries.filter(b => {
    return filters.some(f => b.dest.indexOf(f) > -1)
  })
}

build(entries)
