// THIS IS YOUR CLOUDFLARE WORKER
// It receives requests from frontend and returns JSON

export default {
  async fetch(request, env) {
    // Only allow POST requests to /api/check
    if (request.method === 'POST' && new URL(request.url).pathname === '/api/check') {
      try {
        // Get text from request
        const { text } = await request.json()
        
        // Your grammar checking logic (simple version)
        const result = await checkGrammar(text)
        
        // 🔌 CONNECTION TO DATABASE (if you add Neon later)
        // const sql = neon(env.DATABASE_URL)
        // await sql`INSERT INTO checks (text) VALUES (${text})` 
        
        // Return JSON response
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        })
        
      } catch (error) {
        // Return error as JSON
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }
    
    // Handle other routes
    return new Response('Not found', { status: 404 })
  }
}

// Simple grammar checking function
async function checkGrammar(text) {
  // This is where your actual grammar logic goes
  // For now, return mock data
  
  const words = text.split(' ')
  const sentences = text.split(/[.!?]+/).filter(s => s.length > 0)
  
  // Mock grammar issues
  const matches = []
  
  // Check for "i" instead of "I"
  if (text.includes(' i ')) {
    matches.push({
      message: 'Use "I" instead of "i"',
      offset: text.indexOf(' i '),
      length: 1,
      replacements: ['I']
    })
  }
  
  // Check for double spaces
  if (text.includes('  ')) {
    matches.push({
      message: 'Remove extra spaces',
      offset: text.indexOf('  '),
      length: 2,
      replacements: [' ']
    })
  }
  
  return {
    text: text,
    matches: matches,
    stats: {
      characters: text.length,
      words: words.length,
      sentences: sentences.length,
      errors: matches.length
    }
  }
}
