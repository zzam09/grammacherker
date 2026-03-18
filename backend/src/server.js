const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/check', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Simulate grammar checking
  setTimeout(() => {
    const score = Math.floor(Math.random() * 20) + 80; // 80-100 score
    const issues = [];
    const suggestions = [
      'Consider adding more detail to your text',
      'Your writing is clear and concise',
      'No major grammatical issues found'
    ];

    res.json({
      score,
      issues,
      suggestions,
      id: Date.now().toString()
    });
  }, 1000);
});

app.get('/api/history', (req, res) => {
  // Return empty history for now
  res.json([]);
});

app.delete('/api/history/:id', (req, res) => {
  res.json({ success: true });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 GrammarChecker API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
