require('dotenv').config();
const { Pool } = require('pg');

async function dropAndRecreateTables() {
  console.log('🗑️ حذف وإعادة إنشاء جداول المصادقة...');
  
  if (!process.env.NEON_DATABASE_URL) {
    console.error('❌ متغير NEON_DATABASE_URL غير موجود');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // حذف الجداول الموجودة
    console.log('🗑️ حذف الجداول الموجودة...');
    await pool.query('DROP TABLE IF EXISTS sessions CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('✅ تم حذف الجداول');

    // إعادة إنشاء جدول المستخدمين
    console.log('🔧 إنشاء جدول المستخدمين...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ تم إنشاء جدول المستخدمين');

    // إعادة إنشاء جدول الجلسات
    console.log('🔧 إنشاء جدول الجلسات...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ تم إنشاء جدول الجلسات');

    // إنشاء الفهارس
    console.log('🔧 إنشاء الفهارس...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
      CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
      CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
    `);
    console.log('✅ تم إنشاء الفهارس');

    // إنشاء trigger لتحديث التواريخ
    console.log('🔧 إنشاء trigger لتحديث التواريخ...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    await pool.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ تم إنشاء trigger لتحديث التواريخ');

    // التحقق من الجداول
    const tablesResult = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'sessions') 
      ORDER BY table_name;
    `);
    console.log('📊 الجداول الموجودة:', tablesResult.rows.map(row => row.table_name));

    console.log('🎉 تم حذف وإعادة إنشاء جميع جداول المصادقة بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في حذف وإعادة إنشاء الجداول:', error.message);
  } finally {
    await pool.end();
  }
}

dropAndRecreateTables();
