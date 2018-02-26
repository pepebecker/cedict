'use strict'

const fs = require('fs')
const path = require('path')

const decode = require('./decode')

let data = fs.readFileSync(path.join(__dirname, 'data', 'cedict.bin'))
const entries = decode(data)
data = null

module.exports = entries
