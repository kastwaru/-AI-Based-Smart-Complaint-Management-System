const axios = require('axios');
async function testAI() {
  try {
    const res = await axios.post('http://localhost:5000/api/ai/analyze', {
      title: 'Massive water pipe burst flooding the street',
      description: 'The main water line on 5th Avenue just burst and is causing massive flooding near the intersection. It needs immediate attention before water enters stores.'
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error(err.message);
  }
}
testAI();
