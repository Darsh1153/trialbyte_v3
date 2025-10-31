const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.PGSQL_DB_URL,
  ssl: process.env.DATABASE_URL ? {
    rejectUnauthorized: false,
  } : undefined,
});

async function migrateSitesTable() {
  try {
    console.log('🔄 Starting migration for therapeutic_sites table...');
    console.log('📊 Connection string:', process.env.DATABASE_URL ? 'Production DB' : process.env.PGSQL_DB_URL ? 'Development DB' : 'Not configured');
    
    // Add missing columns to therapeutic_sites table
    const migrations = [
      {
        name: 'Add study_sites column',
        query: `
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name='therapeutic_sites' AND column_name='study_sites'
            ) THEN
              ALTER TABLE therapeutic_sites ADD COLUMN study_sites TEXT[];
              RAISE NOTICE 'Column study_sites added successfully';
            ELSE
              RAISE NOTICE 'Column study_sites already exists';
            END IF;
          END $$;
        `
      },
      {
        name: 'Add principal_investigators column',
        query: `
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name='therapeutic_sites' AND column_name='principal_investigators'
            ) THEN
              ALTER TABLE therapeutic_sites ADD COLUMN principal_investigators TEXT[];
              RAISE NOTICE 'Column principal_investigators added successfully';
            ELSE
              RAISE NOTICE 'Column principal_investigators already exists';
            END IF;
          END $$;
        `
      },
      {
        name: 'Add site_status column',
        query: `
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name='therapeutic_sites' AND column_name='site_status'
            ) THEN
              ALTER TABLE therapeutic_sites ADD COLUMN site_status TEXT;
              RAISE NOTICE 'Column site_status added successfully';
            ELSE
              RAISE NOTICE 'Column site_status already exists';
            END IF;
          END $$;
        `
      },
      {
        name: 'Add site_countries column',
        query: `
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name='therapeutic_sites' AND column_name='site_countries'
            ) THEN
              ALTER TABLE therapeutic_sites ADD COLUMN site_countries TEXT[];
              RAISE NOTICE 'Column site_countries added successfully';
            ELSE
              RAISE NOTICE 'Column site_countries already exists';
            END IF;
          END $$;
        `
      },
      {
        name: 'Add site_regions column',
        query: `
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name='therapeutic_sites' AND column_name='site_regions'
            ) THEN
              ALTER TABLE therapeutic_sites ADD COLUMN site_regions TEXT[];
              RAISE NOTICE 'Column site_regions added successfully';
            ELSE
              RAISE NOTICE 'Column site_regions already exists';
            END IF;
          END $$;
        `
      },
      {
        name: 'Add site_contact_info column',
        query: `
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name='therapeutic_sites' AND column_name='site_contact_info'
            ) THEN
              ALTER TABLE therapeutic_sites ADD COLUMN site_contact_info TEXT[];
              RAISE NOTICE 'Column site_contact_info added successfully';
            ELSE
              RAISE NOTICE 'Column site_contact_info already exists';
            END IF;
          END $$;
        `
      },
      {
        name: 'Add site_notes column (JSON)',
        query: `
          DO $$ 
          BEGIN 
            IF NOT EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name='therapeutic_sites' AND column_name='site_notes'
            ) THEN
              ALTER TABLE therapeutic_sites ADD COLUMN site_notes JSONB;
              RAISE NOTICE 'Column site_notes added successfully';
            ELSE
              RAISE NOTICE 'Column site_notes already exists';
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
      WHERE table_name = 'therapeutic_sites'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Current therapeutic_sites columns:');
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
migrateSitesTable();

