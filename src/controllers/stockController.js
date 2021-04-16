const axios = require('axios');

const stockController = {};

const url = 'http://localhost:8080';

stockController.getStockChart = async (quote, duration, interval) => {
  var end = new Date();
  var start = new Date();
  if (duration == '1D') {
    start.setDate(start.getDate() - 1);
  } else if (duration == '5D') {
    start.setDate(start.getDate() - 5);
  } else if (duration == '1M') {
    start.setMonth(start.getMonth() - 3);
  } else if (duration == '6M') {
    start.setMonth(start.getMonth() - 6);
  } else if (duration == 'YTD') {
    start.setDate(1);
    start.setMonth(0);
  } else if (duration == '1Y') {
    start.setFullYear(start.getFullYear() - 1);
  } else if (duration == '5Y') {
    start.setFullYear(start.getFullYear() - 5);
  } else if (duration == 'Max') {
    start.setFullYear(start.getFullYear() - 40); // backend seems to only have data till 2009
  }
  const { data } = await axios({
    method: 'POST',
    url: `${url}/chart/${quote}`,
    data: {
      'start': {
        'month': (start.getMonth() + 1),
        'day': start.getDate(),
        'year': start.getFullYear(),
      },
      'end': {
        'month': (end.getMonth() + 1),
        'day': end.getDate(),
        'year': end.getFullYear(),
      },
      'interval': interval
    },
  });
  if (data) {
    console.log('nice')
    console.log(data)
    const res = data.map(q => {
      return {
        close: parseFloat(q.Close),
        high: parseFloat(q.High),
        low: parseFloat(q.Low),
        open: parseFloat(q.Open),
        date: new Date(q.Timestamp * 1000),
        volume: q.Volume,
      }
    });
    return res;
  }
  return [];
}

stockController.getStock = async (quote) => {
  const { data } = await axios.get(
    `${url}/quote/${quote}`
  )
  if (data) {
    return data;
  }
  return {};
}

stockController.getStockPrice = async (quote) => {
  const { data } = await axios.get(
    `${url}/quote/${quote}`
  )
  if (data) {
    return data.regularMarketPrice;
  }
  return 0;
}

stockController.getAllStock = async (quotes) => {
  const { data } = await axios({
    method: 'POST',
    url: `${url}/quotes`,
    data: {
      'tickets': quotes
    },
  });
  if (data) {
    return data;
  }
  return [];
}

module.exports = stockController;