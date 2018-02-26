'use strict'

const Pbf = require('pbf')
const fs = require('fs')
const path = require('path')
const decoder = require('./data/cedict.proto.js')

let data = fs.readFileSync(path.join(__dirname, 'data', 'cedict.bin'))
const { entries } = decoder.Dict.read(new Pbf(data))
data = null

module.exports = entries
