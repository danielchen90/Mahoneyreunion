/**
 * Create Super Admin User Script
 * 
 * This script creates the initial super admin user with proper password hashing
 * 
 * Usage: node scripts/create-super-admin.js
 */

const { neon } = require('@neondatabase/serverless')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const DATABASE_URL = process.env.DATABASE_URL

async function createSuperAdmin() {
  console.log('\n🔐 Creating Super Admin User...\n')
  console.log('=' .repeat(60))

  if (!DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL is not set in .env.local')
    process.exit(1)
  }

  const sql = neon(DATABASE_URL)

  try {
    // Default credentials
    const email = 'admin@mahoneyfamily.com'
    const password = 'mahoney2026'
    const name = 'Super Admin'
    const role = 'super_admin'

    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('👤 Name:', name)
    console.log('🎭 Role:', role)
    console.log('=' .repeat(60))

    // Check if user already exists
    console.log('\n🔍 Checking if user already exists...')
    const existingUser = await sql`
      SELECT id, email FROM admin_users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      console.log('⚠️  User already exists!')
      console.log(`   ID: ${existingUser[0].id}`)
      console.log(`   Email: ${existingUser[0].email}`)
      console.log('\n❓ Do you want to update the password? (This will be skipped in script)')
      console.log('   To update password, use the admin dashboard or delete the user first.')
      process.exit(0)
    }

    // Hash password
    console.log('\n🔐 Hashing password...')
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)
    console.log('✅ Password hashed successfully')

    // Create user
    console.log('\n👤 Creating super admin user...')
    const result = await sql`
      INSERT INTO admin_users (email, password_hash, name, role, is_active, email_verified)
      VALUES (${email}, ${password_hash}, ${name}, ${role}, true, true)
      RETURNING id, email, name, role, created_at
    `

    if (result.length > 0) {
      const user = result[0]
      console.log('✅ Super admin user created successfully!')
      console.log('\n' + '=' .repeat(60))
      console.log('📋 USER DETAILS:')
      console.log('=' .repeat(60))
      console.log(`   ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`)
      console.log('=' .repeat(60))
      console.log('\n🎉 SUCCESS! You can now log in with:')
      console.log(`   Email: ${email}`)
      console.log(`   Password: ${password}`)
      console.log('\n⚠️  IMPORTANT: Change this password after first login!')
      console.log('\n📝 Next steps:')
      console.log('   1. Start dev server: npm run dev')
      console.log('   2. Go to: http://localhost:3000/admin')
      console.log('   3. Log in with the credentials above')
      console.log('   4. Change your password in user settings')
      console.log('\n')
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
    console.error('\n🔧 Troubleshooting:')
    console.error('   1. Make sure you ran DATABASE_SCHEMA_ALL_PHASES.sql first')
    console.error('   2. Check that DATABASE_URL in .env.local is correct')
    console.error('   3. Verify the admin_users table exists in Neon')
    console.error('\n')
    process.exit(1)
  }
}

// Run the script
createSuperAdmin()

