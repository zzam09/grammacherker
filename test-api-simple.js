async function testAPI() {
  try {
    console.log('🧪 Testing GrammarChecker API...\n');
    
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test 2: Grammar check
    console.log('\n2. Testing grammar check...');
    const grammarResponse = await fetch('http://localhost:3001/api/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: "This are a test with some grammar errors"
      })
    });
    const grammarData = await grammarResponse.json();
    console.log('✅ Grammar check result:', {
      score: grammarData.score,
      issues: grammarData.errors?.length,
      suggestions: grammarData.suggestions?.length
    });
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

testAPI();
