// Run database migration for Neon PostgreSQL
require('dotenv').config();

const { Pool } = require('pg');
const fs = require('fs');

async function runMigration() {
  console.log('🚀 Running database migration...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Read migration SQL
    const migrationSQL = fs.readFileSync('neon-migrate.sql', 'utf8');
    
    // Execute the entire migration as one script
    console.log('Executing migration script...');
    await pool.query(migrationSQL);

    console.log('🎉 Migration completed successfully!');
    
    // Test the table creation
    const result = await pool.query('SELECT COUNT(*) FROM checks');
    console.log(`✅ Checks table created with ${result.rows[0].count} rows`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration().catch(console.error);
