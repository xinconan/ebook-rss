const fs = require('fs');
const ini = require('ini');
const turingApi = require('./turing')
const epubApi = require('./epub')
const { sendWx } = require('./notify')

const configPath = './config.ini';

const config = ini.parse(fs.readFileSync(configPath, 'utf-8'));

const getBooks = async function(){
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
    }
  } catch (error) {
    // error
    console.log(error)
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

getBooks();
