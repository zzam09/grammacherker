// Test the GrammarCheck API
require('dotenv').config();

const http = require('http');

function testAPI() {
  console.log('🧪 Testing GrammarCheck API...');
  
  const testData = {
    text: "This are a test with some grammar errors"
  };

  const postData = JSON.stringify(testData);

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/check',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
    
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', JSON.parse(body));
      console.log('\n✅ API test completed successfully!');
    });
  });

  req.on('error', (e) => {
    console.error('❌ API test failed:', e.message);
  });

  req.write(postData);
  req.end();
}

testAPI();
