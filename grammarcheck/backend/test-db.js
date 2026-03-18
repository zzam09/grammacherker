// Simple test to verify database connection
require('dotenv').config();

const { Pool } = require('pg');

console.log('Testing Neon PostgreSQL connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('[user]')) {
  console.error('❌ DATABASE_URL is not properly configured');
  console.log('\n📝 To set up Neon PostgreSQL:');
  console.log('1. Go to: https://console.neon.tech/');
  console.log('2. Sign up or login');
  console.log('3. Create a new project');
  console.log('4. Copy the connection string');
  console.log('5. Update .env file with your connection string');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()')
  .then(res => {
    console.log('✅ Database connected successfully!');
    console.log('Server time:', res.rows[0].now);
    pool.end();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.log('\n📝 To fix this:');
    console.log('1. Go to: https://console.neon.tech/');
    console.log('2. Create or select your project');
    console.log('3. Copy the connection string');
    console.log('4. Update .env file with your Neon connection string');
    pool.end();
  });
