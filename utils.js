const dayjs = require('dayjs')

function formatTime(val) {
  if (val) return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

function log(str) {
  console.log(`${formatTime()}  ${str}`)
}

module.exports = {
  formatTime,
  log,
}