#!/usr/bin/env node

'use strict'

const pump = require('pump')
const byline = require('byline')
const Pbf = require('pbf')
const through = require('through2')
const reduce = require('through2-reduce')
const exec = require('child_process').exec
const path = require('path')
const fs = require('fs')
const hsk = require('./hsk')

const PATHS = {
  cedict: path.join(__dirname, '../data/cedict_ts.u8'),
  dest: path.join(__dirname, '../data/cedict.bin')
}

const parseLine = (line, _, done) => {
  if (line == '' || /^#/.test(line)) {
    return done()
  }
  line = line.toString('utf8')

  const params = line.slice(0, -1).split('/')
  const mandarin = params[0].slice(0, -1).substr(0, params[0].length - 2).split(' [')
  const translations = params.slice(1)

  const characters = mandarin[0].split(' ')
  const traditional = characters[0]
  const simplified = characters[1]
  const pinyin = mandarin[1].replace(/\u:/g, 'ü')
  let hskLvl = 0

  for (const i in hsk) {
    if (hsk[i].includes(simplified)) {
      hskLvl = parseInt(i) + 1
    }
  }

  done(null, {
    traditional,
    simplified: simplified !== traditional ? simplified : null,
    pinyin,
    translations,
    hsk: hskLvl
  })
}

const reduceLines = (acc, line) => {
  let entry = acc[line.traditional]
  if (!acc[line.traditional]) {
    entry = acc[line.traditional] = {
      traditional: line.traditional,
      simplified: line.simplified,
      definitions: [],
      hsk: line.hsk
    }
  }
  entry.definitions.push({
    pinyin: line.pinyin,
    translations: line.translations
  })
  return acc
}

const encodeEntries = encoder => (entries, _, done) => {
  const dict = {entries: []}
  for (let traditional in entries) {
    dict.entries.push(entries[traditional])
  }
  
  const pbf = new Pbf()
  encoder.Dict.write(dict, pbf)
  done(null, pbf.finish())
}

const build = file => {
  return new Promise((resolve, reject) => {
    exec('npm run proto', err => {
      if (err) {
        reject(err)
      } else {
        console.log('Building cedict.bin')
        const encoder = require('../data/cedict.proto.js')
        pump(
          fs.createReadStream(file),
          byline.createStream(),
          through.obj(parseLine),
          reduce.obj(reduceLines, Object.create(null)),
          through.obj(encodeEntries(encoder)),
          fs.createWriteStream(PATHS.dest),
          err => {
            if (err) reject(err)
            else resolve()
          }
        )
      }
    })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      console.log('Cleaning up ' + path.basename(PATHS.cedict))
      fs.unlink(PATHS.cedict, err => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  })
}

module.exports = build

if (require.main === module) {
  build(PATHS.cedict)
  .then(() => console.log('Done'))
  .catch(console.error)
}
