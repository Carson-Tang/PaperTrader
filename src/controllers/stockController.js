const axios = require('axios');

const stockController = {};

const url = 'http://localhost:8080';

stockController.getStockChart = async (quote, startDate, endDate) => {
  const { data } = await axios.get(
    `${url}/chart/${quote}`
  );
  if (data) {
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