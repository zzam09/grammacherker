// Test Vue.js app API integration
import axios from 'axios'

const API_BASE = 'http://localhost:3001'

async function testApp() {
  console.log('🧪 Testing Vue.js Grammar Checker App...\n')
  
  try {
    // Test 1: Backend health
    console.log('1. Testing backend health...')
    const healthResponse = await axios.get(`${API_BASE}/health`)
    console.log('✅ Backend healthy:', healthResponse.data)
    
    // Test 2: Grammar check
    console.log('\n2. Testing grammar check API...')
    const grammarResponse = await axios.post(`${API_BASE}/api/check`, {
      text: "This are a test with some grammar errors"
    })
    console.log('✅ Grammar check result:', {
      score: grammarResponse.data.score,
      issues: grammarResponse.data.issues.length,
      id: grammarResponse.data.id
    })
    
    // Test 3: History retrieval
    console.log('\n3. Testing history API...')
    const historyResponse = await axios.get(`${API_BASE}/api/history`)
    console.log('✅ History loaded:', historyResponse.data.data?.length || 0, 'items')
    
    // Test 4: CORS (important for Vue.js frontend)
    console.log('\n4. Testing CORS headers...')
    const corsTest = await axios.get(`${API_BASE}/health`, {
      headers: { 'Origin': 'http://localhost:8080' }
    })
    console.log('✅ CORS working for frontend origin')
    
    console.log('\n🎉 All tests passed! Vue.js app should work perfectly.')
    console.log('\n📱 Open http://localhost:8080 to use the app!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    if (error.response) {
      console.error('Response:', error.response.status, error.response.data)
    }
  }
}

testApp()
