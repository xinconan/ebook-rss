const fs = require('fs');
const ini = require('ini');
const turingApi = require('./turing')
const { sendWx } = require('./notify')

const configPath = './config.ini';

const config = ini.parse(fs.readFileSync(configPath, 'utf-8'));
console.log(config)

const getBooks = async function(){
  try {
    const turingBooks = await turingApi.getNewBooks();
    const newTuringBooks = getNews(turingBooks, config.turing.id)
    console.log(newTuringBooks)
    if (newTuringBooks.length) {
      // 取最新的更新配置
      sendWx(newTuringBooks)
      config.turing.id = newTuringBooks[0].id;
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
// config.epubit.id = '2345'
// fs.writeFileSync(configPath, ini.stringify(config))