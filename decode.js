'use strict'

const Pbf = require('pbf')
const decoder = require('./data/cedict.proto.js')

const decode = (data) => {
  const { entries } = decoder.Dict.read(new Pbf(data))
  return entries
}

module.exports = decode
module.exports.decode = decode
