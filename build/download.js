#!/usr/bin/env node

'use strict'

const exec = require('child_process').exec
const path = require('path')

const pExec = cmd => new Promise((resolve, reject) => {
  exec(cmd, err => {
    if (err) reject(err)
    else resolve()
  })
})

const download = async (url, file) => {
  console.log('Downloading CEDICT Archive')
  await pExec(`curl -sL ${url} > ${file}.zip`)

  console.log('Unpacking CEDICT Archive')
  await pExec(`unzip -np ${file}.zip > ${file}`)

  console.log('Cleaning up')
  await pExec(`rm -rf ${file}.zip`)

  return file
}

module.exports = download

if (require.main === module) {
  const url = 'https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip'
  const file = path.join(__dirname, '../data/cedict_ts.u8')
  download(url, file)
  .then(() => console.log('Done'))
  .catch(console.error)
}
