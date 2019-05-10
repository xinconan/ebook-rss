const schedule = require('node-schedule');
const update = require('./update')

// 每天12点更新一次
schedule.scheduleJob('0 12 * * *', update)