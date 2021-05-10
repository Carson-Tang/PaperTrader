const axios = require('axios');

const url = 'http://localhost:8080';

const codeController = {};

codeController.sendScript = async (code) => {
  const { data } = await axios({
    method: 'POST',
    url: `${url}/runCode`,
    data: {
      'code': code
    },
  });
  if (data) {
    return data;
  }
  // bad, shouldn't reach here
  return "";
}

module.exports = codeController;