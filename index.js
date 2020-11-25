'use strict'

const { readFileSync } = require('fs')
const { join } = require('path')

const { decode } = require('./decode')

let data = readFileSync(join(__dirname, 'data', 'cedict.bin'))
const entries = decode(data)
data = null

module.exports = entries
