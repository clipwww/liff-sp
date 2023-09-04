// 測試用

const path = require('node:path')
const express = require('express')

const app = express()
const host = '0.0.0.0'
const port = 8084

app.use('/liff-sp', express.static(path.join(__dirname, '../dist')))

app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`)
})
