import { createServer } from 'http';
import { prisma } from './db.js';

const handler = async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // Basic routing
  if (url.pathname === "/api/health" && req.method === "GET") {
    try {
      await prisma.$connect();
      res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
      res.end(JSON.stringify({ 
        status: "ok", 
        message: "Grammar check backend is running",
        database: "connected"
      }));
      return;
    } catch (error) {
      res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" });
      res.end(JSON.stringify({ 
        status: "error", 
        message: "Database connection failed",
        error: error.message
      }));
      return;
    }
  }

  if (url.pathname === "/api/check" && req.method === "POST") {
    try {
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
        req.on('error', reject);
      });
      
      const { text, userId } = body;

      if (!text) {
        res.writeHead(400, { ...corsHeaders, "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Text is required" }));
        return;
      }

      // Basic grammar check logic (placeholder)
      const suggestions = [];
      
      // Simple checks
      if (text.includes('  ')) {
        suggestions.push({
          type: 'spacing',
          message: 'Multiple spaces detected',
          suggestion: 'Replace multiple spaces with single space'
        });
      }

      // Check for common issues
      if (text.match(/^[a-z]/)) {
        suggestions.push({
          type: 'capitalization',
          message: 'Sentence should start with capital letter',
          suggestion: 'Capitalize the first letter'
        });
      }

      if (!text.match(/[.!?]$/)) {
        suggestions.push({
          type: 'punctuation',
          message: 'Sentence should end with punctuation',
          suggestion: 'Add period, question mark, or exclamation mark'
        });
      }

      // Save to database if userId provided
      let savedCheck = null;
      if (userId) {
        try {
          savedCheck = await prisma.grammarCheck.create({
            data: {
              text: text,
              score: Math.max(0, 100 - (suggestions.length * 10)),
              suggestions: suggestions,
              userId: userId
            }
          });
        } catch (dbError) {
          console.error('Failed to save to database:', dbError);
          // Continue with response even if DB save fails
        }
      }

      const response = {
        original: text,
        suggestions,
        corrected: text, // Would implement actual correction logic
        score: Math.max(0, 100 - (suggestions.length * 10)),
        saved: savedCheck ? true : false,
        id: savedCheck?.id || null
      };

      res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
      return;
    } catch (error) {
      res.writeHead(400, { ...corsHeaders, "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON", details: error.message }));
      return;
    }
  }

  // Get user's grammar checks history
  if (url.pathname === "/api/history" && req.method === "GET") {
    try {
      const userId = url.searchParams.get('userId');
      if (!userId) {
        res.writeHead(400, { ...corsHeaders, "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "userId is required" }));
        return;
      }

      const checks = await prisma.grammarCheck.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50 // Limit to last 50 checks
      });

      res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
      res.end(JSON.stringify(checks));
      return;
    } catch (error) {
      res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch history", details: error.message }));
      return;
    }
  }

  // Create or get user
  if (url.pathname === "/api/user" && req.method === "POST") {
    try {
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
        req.on('error', reject);
      });
      
      const { email } = body;

      if (!email) {
        res.writeHead(400, { ...corsHeaders, "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Email is required" }));
        return;
      }

      let user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        user = await prisma.user.create({
          data: { email }
        });
      }

      res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
      return;
    } catch (error) {
      res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to create/get user", details: error.message }));
      return;
    }
  }

  // 404 for unknown routes
  res.writeHead(404, { ...corsHeaders, "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
};

console.log("Grammar check backend starting on http://localhost:8000");
const server = createServer(handler);
server.listen(8000);
