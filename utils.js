const dayjs = require('dayjs')

function formatTime(val) {
  if (val) return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

function log(str) {
  console.log(`${formatTime()}  ${str}`)
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36';

module.exports = {
  formatTime,
  log,
  UA,
}