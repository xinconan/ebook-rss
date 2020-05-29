const axios = require("axios");
const cheerio = require("cheerio");

const getNewBooks = async function () {
  const { status, data: turingHtml } = await axios.get(
    "https://www.ituring.com.cn/book?tab=ebook&sort=new"
  );
  if (status !== 200) {
    return []; // 请求失败，直接返回空
  }
  const $ = cheerio.load(turingHtml);
  const list = $(".block-books.block-books-grid li");
  const books = [];
  list.each((i, item) => {
    const book = $(item).find(".book-img a")[0];
    // full path
    const href = "https://www.ituring.com.cn" + $(book).attr("href");
    books[i] = {
      title: $(book).attr("title"),
      href,
      id: href.match(/\/book\/(.*)/)[1],
    };
  });
  return books;
};

const emptyObj = {
  hasSample: false,
  title: "",
};

/**
 * 根据id查询是否存在样书
 * @param {*} id
 */
const hasSampleBook = async function (id) {
  const { status, data: turingHtml } = await axios.get(
    `https://www.ituring.com.cn/book/${id}`
  );
  if (status !== 200) {
    return emptyObj;
  }
  const $ = cheerio.load(turingHtml);
  const btn = $(".btn-block.btn-default");
  const title = $(".book-title").text().trim()
  if (btn.length) {
    return {
      hasSample: !btn.hasClass("disabled"),
      title,
    };
  }
  return emptyObj;
};

module.exports = {
  getNewBooks,
  hasSampleBook,
};
