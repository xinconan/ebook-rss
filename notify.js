const axios = require('axios');
const qs = require('querystring');
const { serverApi, pushPlus } = require('./config');
const { log } = require('./utils');

const getMD = function (books) {
  let str = '';
  for (let i = 0; i < books.length; i++) {
    str += `- [${books[i].title}](${books[i].href})\r\n`;
  }
  return str;
};

const sendWx = async function (books, text) {
  const params = {
    text,
    desp: getMD(books),
  };

  try {
    const { status, data } = await axios.post(
      `https://sctapi.ftqq.com/${serverApi}.send`,
      qs.stringify(params)
    );
    if (status === 200) {
      log(`${text}，通知成功`);
    }
  } catch (error) {
    log(error);
  }
};

const sendPlus = async function (text) {
  try {
    const { status } = await axios.post('http://www.pushplus.plus/send', {
      token: pushPlus,
      content: text,
      template: 'markdown',
      title: '汇率有更新啦',
      topic: 'jpy',
    });
    if (status === 200) {
      log('汇率更新通知成功。', text);
    }
  } catch (e) {
    log(e);
  }
};

module.exports = {
  sendWx,
  sendPlus,
};
