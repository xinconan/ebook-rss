const axios = require('axios');
const qs = require('querystring')

const getNewBooks = async function() {
  const params = {
    'page': 1,
    'rows': 12,
    'searchColumn': '',
    'eleEdPrice': '',
    'categoryId': '',
    'order': 'desc',
    'sort': 'ebookShelvesDate',
    'listed': 1,
    'isEbook': 1
  }
  const headers = {
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Host': 'www.epubit.com',
    'Origin': 'https://www.epubit.com',
    'Referer': 'https://www.epubit.com/book/screen?flagBookType=2',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  }
  try {
    const {status, data} = await axios({
      method: 'post',
      url: 'https://www.epubit.com/book/search', 
      data: qs.stringify(params), 
      headers,
    });
    if (status !== 200) {
      return []; // 请求失败，直接返回空
    }
    if (data.data && data.data.rows) {
      return data.data.rows.map(item => {
        return {
          title: item.name,
          id: item.id,
          href: 'https://www.epubit.com/book/detail?id=' + item.id
        }
      });
    } else {
      return []
    }
  } catch (error) {
    console.log(error)
    return []
  }
}

module.exports = {
  getNewBooks
}