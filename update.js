const fs = require('fs');
const ini = require('ini');
const Git = require('simple-git')
const path = require('path')
const turingApi = require('./turing')
const epubApi = require('./epub')
const { sendWx } = require('./notify')
const { log } = require('./utils')

const configPath = './config.ini';
// git path
const RESP_PATH = path.join('./')

const getBooks = async function(){
  const config = ini.parse(fs.readFileSync(configPath, 'utf-8'));
  try {
    const turingBooks = await turingApi.getNewBooks();
    const newTuringBooks = getNews(turingBooks, config.turing.id)
    const epubBooks = await epubApi.getNewBooks();
    const newEpubBooks = getNews(epubBooks, config.epub.id)
    const newBooks = [...newTuringBooks, ...newEpubBooks]
    if (newBooks.length) {
      // 取最新的更新配置
      sendWx(newBooks)
      if (newTuringBooks.length) {
        config.turing.id = newTuringBooks[0].id;
      }
      if (newEpubBooks.length) {
        config.epub.id = newEpubBooks[0].id;
      }
      fs.writeFileSync(configPath, ini.stringify(config))
      commit();
    } else {
      log('没有更新')
    }
  } catch (error) {
    // error
    log(error)
  }
}

// 和之前的id对比，获取最新的条目
const getNews = function(books, latestId) {
  const newBooks = [];
  for (let i = 0; i< books.length; i++) {
    if (books[i].id !== latestId) {
      newBooks.push(books[i])
    } else {
      break;
    }
  }
  return newBooks
}

// 更新
function update() {
  log('开始更新')

  Git(RESP_PATH)
    .pull()
    .exec(getBooks)
}

function commit() {
  log('开始上传更新')

  Git(RESP_PATH)
    .add('./config.ini')
    .commit('update latest book id')
    .push(['-u', 'origin', 'master'], () => log('完成更新和上传！'));
}

module.exports = update
