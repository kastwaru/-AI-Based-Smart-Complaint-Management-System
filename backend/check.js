const axios = require('axios');
require('dotenv').config();
async function check() {
  try {
    const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [{role: 'user', content: 'hello'}]
    }, {
      headers: { Authorization: 'Bearer ' + process.env.OPENROUTER_API_KEY }
    });
    console.log(res.data);
  } catch(e) {
    console.log(e.response ? e.response.status : 'No response', e.response ? e.response.data : e.message);
  }
}
check();
