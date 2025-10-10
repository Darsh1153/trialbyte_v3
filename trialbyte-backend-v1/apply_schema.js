const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function applySchema() {
  try {
    console.log('Connecting to database...');
    
    // Read the schema file
    const fs = require('fs');
    const schema = fs.readFileSync('./dropdown_management_schema.sql', 'utf8');
    
    console.log('Applying dropdown management schema...');
    await pool.query(schema);
    
    console.log('✅ Schema applied successfully!');
    
    // Test the tables
    const categoriesResult = await pool.query('SELECT COUNT(*) FROM dropdown_categories');
    const optionsResult = await pool.query('SELECT COUNT(*) FROM dropdown_options');
    
    console.log(`📊 Categories: ${categoriesResult.rows[0].count}`);
    console.log(`📊 Options: ${optionsResult.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error applying schema:', error.message);
  } finally {
    await pool.end();
  }
}

applySchema();
