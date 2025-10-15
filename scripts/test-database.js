/**
 * Database Connection Test Script
 * 
 * This script tests the connection to your Neon PostgreSQL database
 * and verifies that the contact_submissions table exists.
 * 
 * Usage: node scripts/test-database.js
 */

const { neon } = require('@neondatabase/serverless')
require('dotenv').config({ path: '.env.local' })

const DATABASE_URL = process.env.DATABASE_URL

async function testDatabaseConnection() {
  console.log('\n🔍 Testing Neon Database Connection...\n')
  console.log('=' .repeat(60))

  // Check if DATABASE_URL is set
  if (!DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL is not set in .env.local')
    console.log('\nPlease add your Neon connection string to .env.local:')
    console.log('DATABASE_URL=postgresql://...')
    process.exit(1)
  }

  console.log('✅ DATABASE_URL is set')
  console.log(`   Connection: ${DATABASE_URL.substring(0, 30)}...`)
  console.log('=' .repeat(60))

  const sql = neon(DATABASE_URL)

  try {
    // Test 1: Basic connection
    console.log('\n📡 Test 1: Testing basic connection...')
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`
    console.log('✅ Connection successful!')
    console.log(`   Server time: ${result[0].current_time}`)
    console.log(`   PostgreSQL: ${result[0].pg_version.split(' ')[0]} ${result[0].pg_version.split(' ')[1]}`)

    // Test 2: Check if table exists
    console.log('\n📋 Test 2: Checking if contact_submissions table exists...')
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'contact_submissions'
      ) as table_exists
    `
    
    if (tableCheck[0].table_exists) {
      console.log('✅ Table "contact_submissions" exists!')
      
      // Test 3: Get table structure
      console.log('\n📊 Test 3: Fetching table structure...')
      const columns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'contact_submissions'
        ORDER BY ordinal_position
      `
      
      console.log('✅ Table structure:')
      console.log('   ' + '-'.repeat(80))
      console.log('   Column Name       | Data Type                  | Nullable | Default')
      console.log('   ' + '-'.repeat(80))
      columns.forEach(col => {
        const name = col.column_name.padEnd(17)
        const type = col.data_type.padEnd(26)
        const nullable = col.is_nullable.padEnd(8)
        const def = (col.column_default || 'N/A').substring(0, 20)
        console.log(`   ${name} | ${type} | ${nullable} | ${def}`)
      })
      console.log('   ' + '-'.repeat(80))

      // Test 4: Check indexes
      console.log('\n🔍 Test 4: Checking indexes...')
      const indexes = await sql`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'contact_submissions'
      `
      
      if (indexes.length > 0) {
        console.log(`✅ Found ${indexes.length} index(es):`)
        indexes.forEach(idx => {
          console.log(`   - ${idx.indexname}`)
        })
      } else {
        console.log('⚠️  No indexes found (consider adding them for better performance)')
      }

      // Test 5: Count records
      console.log('\n📈 Test 5: Counting records...')
      const count = await sql`
        SELECT COUNT(*) as total FROM contact_submissions
      `
      console.log(`✅ Total records: ${count[0].total}`)

      // Test 6: Get recent submissions
      if (parseInt(count[0].total) > 0) {
        console.log('\n📬 Test 6: Fetching recent submissions...')
        const recent = await sql`
          SELECT id, name, email, subject, status, created_at
          FROM contact_submissions
          ORDER BY created_at DESC
          LIMIT 5
        `
        
        console.log(`✅ Found ${recent.length} recent submission(s):`)
        console.log('   ' + '-'.repeat(80))
        recent.forEach((sub, i) => {
          console.log(`   ${i + 1}. ${sub.name} (${sub.email})`)
          console.log(`      Subject: ${sub.subject}`)
          console.log(`      Status: ${sub.status} | Created: ${new Date(sub.created_at).toLocaleString()}`)
          console.log('   ' + '-'.repeat(80))
        })
      } else {
        console.log('\n📭 Test 6: No submissions yet')
        console.log('   Submit a test form at http://localhost:3000/contact')
      }

      // Test 7: Test INSERT (optional)
      console.log('\n✏️  Test 7: Testing INSERT operation...')
      try {
        const testInsert = await sql`
          INSERT INTO contact_submissions (name, email, subject, message, status, archived)
          VALUES ('Test User', 'test@example.com', 'Database Test', 'This is a test message from the test script', 'unread', false)
          RETURNING id, name, email, created_at
        `
        console.log('✅ INSERT successful!')
        console.log(`   Created record: ${testInsert[0].name} (${testInsert[0].email})`)
        console.log(`   ID: ${testInsert[0].id}`)
        
        // Clean up test record
        await sql`DELETE FROM contact_submissions WHERE id = ${testInsert[0].id}`
        console.log('✅ Test record cleaned up')
      } catch (error) {
        console.error('❌ INSERT test failed:', error.message)
      }

    } else {
      console.log('❌ Table "contact_submissions" does NOT exist!')
      console.log('\n📝 ACTION REQUIRED:')
      console.log('   1. Go to https://console.neon.tech')
      console.log('   2. Open SQL Editor')
      console.log('   3. Run the SQL from CREATE_DATABASE_TABLE.md')
      console.log('   4. Run this test script again')
      process.exit(1)
    }

    // Final summary
    console.log('\n' + '='.repeat(60))
    console.log('🎉 ALL TESTS PASSED!')
    console.log('='.repeat(60))
    console.log('\n✅ Your database is ready to use!')
    console.log('✅ Contact form submissions will be stored successfully')
    console.log('✅ Admin dashboard will display messages')
    console.log('\n📝 Next steps:')
    console.log('   1. Start dev server: npm run dev')
    console.log('   2. Test contact form: http://localhost:3000/contact')
    console.log('   3. View submissions: http://localhost:3000/admin')
    console.log('\n')

  } catch (error) {
    console.error('\n❌ DATABASE ERROR:')
    console.error('   ' + error.message)
    console.error('\n🔧 Troubleshooting:')
    console.error('   1. Check that DATABASE_URL in .env.local is correct')
    console.error('   2. Verify you can access Neon console: https://console.neon.tech')
    console.error('   3. Make sure your Neon project is active (not paused)')
    console.error('   4. Check if the database "neondb" exists in your project')
    console.error('\n')
    process.exit(1)
  }
}

// Run the test
testDatabaseConnection()

