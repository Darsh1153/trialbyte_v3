const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.PGSQL_DB_URL,
  ssl: process.env.DATABASE_URL ? {
    rejectUnauthorized: false,
  } : undefined,
});

async function migrateTimingTable() {
  try {
    console.log('🔄 Starting migration for therapeutic_timing table...');
    console.log('📊 Connection string:', process.env.DATABASE_URL ? 'Production DB' : process.env.PGSQL_DB_URL ? 'Development DB' : 'Not configured');
    
    // Add missing columns to therapeutic_timing table
    const migrations = [
      {
        name: 'Add overall_duration_complete column',
        query: `
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name='therapeutic_timing' AND column_name='overall_duration_complete'
            ) THEN
              ALTER TABLE therapeutic_timing ADD COLUMN overall_duration_complete TEXT;
              RAISE NOTICE 'Column overall_duration_complete added successfully';
            ELSE
              RAISE NOTICE 'Column overall_duration_complete already exists';
            END IF;
          END $$;
        `
      },
      {
        name: 'Add overall_duration_publish column',
        query: `
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name='therapeutic_timing' AND column_name='overall_duration_publish'
            ) THEN
              ALTER TABLE therapeutic_timing ADD COLUMN overall_duration_publish TEXT;
              RAISE NOTICE 'Column overall_duration_publish added successfully';
            ELSE
              RAISE NOTICE 'Column overall_duration_publish already exists';
            END IF;
          END $$;
        `
      },
      {
        name: 'Add timing_references column (JSONB)',
        query: `
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name='therapeutic_timing' AND column_name='timing_references'
            ) THEN
              ALTER TABLE therapeutic_timing ADD COLUMN timing_references JSONB;
              RAISE NOTICE 'Column timing_references added successfully';
            ELSE
              RAISE NOTICE 'Column timing_references already exists';
            END IF;
          END $$;
        `
      }
    ];
    
    // Execute each migration
    for (const migration of migrations) {
      console.log(`\n📝 ${migration.name}...`);
      await pool.query(migration.query);
      console.log(`✅ ${migration.name} - Done`);
    }
    
    // Verify the schema
    console.log('\n📊 Verifying table schema...');
    const schemaResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'therapeutic_timing'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Current therapeutic_timing columns:');
    schemaResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the migration
migrateTimingTable();

