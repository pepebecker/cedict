#!/usr/bin/env node

'use strict'

const path = require('path')

const download = require('./download')
const build = require('./build')

const PATHS = {
  url: 'https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip',
  cedict: path.join(__dirname, '../data/cedict_ts.u8'),
  dest: path.join(__dirname, '../data/cedict.bin')
}

download(PATHS.url, PATHS.cedict)
.then(build)
.then(() => console.log('Done'))
.catch(console.error)
