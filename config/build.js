const fs = require('fs')
const exist = fs.existsSync
const mkdir = fs.mkdirSync
const pack = require('../package.json')
const getAllEntries = require('./entry').getAllEntries
const build = require('./bundle')

if (!exist('dist')) {
  mkdir('dist')
}

// update installation.md
const langs = ['en']
langs.forEach(lang => {
  const installation = fs
    .readFileSync(`./gitbook/${lang}/installation.md`, 'utf-8')
    .replace(
      /<script src="https:\/\/unpkg\.com\/vue-validator@[\d\-\w.]+.[\d]+\/dist\/vue-validator\.min\.js"><\/script>/,
      '<script src="https://unpkg.com/vue-validator@' + pack.version + '/dist/vue-validator.min.js"></script>'
    )
  fs.writeFileSync(`./gitbook/${lang}/installation.md`, installation)
})

let entries = getAllEntries()

// filter entries via command line arg
if (process.argv[2]) {
  const filters = process.argv[2].split(',')
  entries = entries.filter(b => {
    return filters.some(f => b.dest.indexOf(f) > -1)
  })
}

build(entries)
