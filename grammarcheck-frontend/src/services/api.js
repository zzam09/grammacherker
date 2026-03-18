// THIS FILE CONNECTS FRONTEND TO BACKEND
// It just fetches JSON from your Cloudflare Worker

const API_URL = 'https://grammarcheck-api.your-name.workers.dev'  // ← YOUR CLOUDFLARE URL

export const grammarApi = {
  // Get JSON response from backend
  async checkText(text) {
    try {
      const response = await fetch(`${API_URL}/api/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      })
      
      // Returns ONLY JSON
      const data = await response.json()
      return data
      
    } catch (error) {
      console.error('API Error:', error)
      return { error: 'Failed to connect to backend' }
    }
  },
  
  // Get history (if you add it later)
  async getHistory(userId) {
    const response = await fetch(`${API_URL}/api/history/${userId}`)
    return response.json()
  }
}
