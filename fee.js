// 实时汇率获取
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('querystring');
const { UA, log } = require('./utils');

const getJPYFee = async function () {
  const { status, data: feeHtml } = await axios({
    url: 'https://srh.bankofchina.com/search/whpj/search_cn.jsp',
    method: 'post',
    data: qs.stringify({
      erectDate: '',
      nothing: '',
      pjname: '日元',
    }),
    headers: {
      Origin: 'https://www.boc.cn',
      Referer: 'https://www.boc.cn/',
      'User-Agent': UA,
    },
  });
  if (status !== 200) {
    log('获取汇率失败');
    return null;
  }
  const $ = cheerio.load(feeHtml);
  const first = $('.BOC_main.publish tbody tr').eq(1);
  const td = $(first).find('td');
  const fee = $(td[1]).text().trim();
  const time = $(td[6]).text().trim();
  return {
    fee,
    time,
  };
};

module.exports = {
  getJPYFee,
};
