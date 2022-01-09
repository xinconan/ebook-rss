const schedule = require('node-schedule');
const update = require('./update')

// 每天10点到16点，半小时跑一次
schedule.scheduleJob('0 */30 10-16 * * *', update)