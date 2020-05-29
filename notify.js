const axios = require("axios");
const qs = require("querystring");
const { serverApi } = require("./config");
const { log } = require("./utils");

const getMD = function (books) {
  let str = "";
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
      `https://sc.ftqq.com/${serverApi}.send`,
      qs.stringify(params)
    );
    if (status === 200) {
      log(`${text}，通知成功`);
    }
  } catch (error) {
    log(error);
  }
};

module.exports = {
  sendWx,
};
