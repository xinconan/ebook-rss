const fs = require('fs');
const ini = require('ini');
const Git = require('simple-git');
const path = require('path');
const turingApi = require('./turing');
// const epubApi = require('./epub')
const { sendWx, sendPlus } = require('./notify');
const { log } = require('./utils');
const { getJPYFee } = require('./fee');

const configPath = './config.ini';
// git path
const RESP_PATH = path.join('./');

const getBooks = async function () {
  const config = ini.parse(fs.readFileSync(configPath, 'utf-8'));
  try {
    const turingBooks = await turingApi.getNewEBooks();
    const newTuringBooks = getNews(turingBooks, config.turing.id);
    // const epubBooks = await epubApi.getNewBooks();
    // const newEpubBooks = getNews(epubBooks, config.epub.id)
    const newBooks = [...newTuringBooks];
    let needUpdate = false;
    if (newBooks.length) {
      // 取最新的更新配置
      sendWx(newBooks, '电子书更新了');
      if (newTuringBooks.length) {
        config.turing.id = newTuringBooks[0].id;
      }
      // if (newEpubBooks.length) {
      //   config.epub.id = newEpubBooks[0].id;
      // }
      needUpdate = true;
    } else {
      log('no ebook update');
    }
    // const samples = config.turing.samples.split(",");
    // const sampleBooks = [];
    // for (let [k, v] of samples.entries()) {
    //   if (v) {
    //     const res = await turingApi.hasSampleBook(v);
    //     if (res.hasSample) {
    //       sampleBooks.push({
    //         href: `https://www.ituring.com.cn/book/${v}`,
    //         title: res.title,
    //       });
    //       samples.splice(k, 1);
    //     }
    //   }
    // }
    // if (sampleBooks.length) {
    //   sendWx(sampleBooks, "有样书可以兑换了");
    //   needUpdate = true;
    //   config.turing.samples = samples.join(",");
    // }
    if (needUpdate) {
      fs.writeFileSync(configPath, ini.stringify(config));
      commit();
    }
  } catch (error) {
    // error
    log(error);
  }

  getJPYFee().then((data) => {
    log(JSON.stringify(data));
    if (data.fee) {
      if (Number(data.fee) * 10000 >= Number(config.fee.jpy)) {
        const feeContent = `最新汇率：${data.fee}\n更新时间：${data.time}`;
        sendPlus(feeContent);
      }
    }
  });
};

// 和之前的id对比，获取最新的条目
const getNews = function (books, latestId) {
  const newBooks = [];
  for (let i = 0; i < books.length; i++) {
    if (books[i].id != latestId) {
      books[i].title = books[i].name;
      books[i].href = `https://www.ituring.com.cn/book/${books[i].id}`;
      newBooks.push(books[i]);
    } else {
      break;
    }
  }
  return newBooks;
};

// 更新
function update() {
  log('开始更新');

  Git(RESP_PATH).pull().exec(getBooks);
}

function commit() {
  log('开始上传更新');

  Git(RESP_PATH)
    .add('./config.ini')
    .commit('update latest book id')
    .push(['-u', 'origin', 'master'], () => log('完成更新和上传！'));
}

module.exports = update;
