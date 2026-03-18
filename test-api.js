const axios = require('axios');

async function testAPI() {
  try {
    console.log('🧪 Testing GrammarChecker API...\n');
    
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('✅ Health check:', healthResponse.data);
    
    // Test 2: Grammar check
    console.log('\n2. Testing grammar check...');
    const grammarResponse = await axios.post('http://localhost:3001/api/check', {
      text: "This are a test with some grammar errors"
    });
    console.log('✅ Grammar check result:', {
      score: grammarResponse.data.score,
      issues: grammarResponse.data.errors?.length,
      suggestions: grammarResponse.data.suggestions?.length
    });
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
}

testAPI();
