require('dotenv').config();
const { Pool } = require('pg');

async function testAuth() {
  console.log('🧪 اختبار نظام المصادقة...');
  
  if (!process.env.NEON_DATABASE_URL) {
    console.error('❌ متغير NEON_DATABASE_URL غير موجود');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // اختبار إنشاء مستخدم
    console.log('📝 إنشاء مستخدم تجريبي...');
    
    const testUser = {
      username: 'testuser',
      phone_number: '0550123456',
      password: '123456',
      full_name: 'مستخدم تجريبي'
    };

    // حذف المستخدمين التجريبيين
    await pool.query('DELETE FROM users WHERE username = $1 OR phone_number = $2', [testUser.username, testUser.phone_number]);
    
    // إنشاء المستخدم
    const insertResult = await pool.query(`
      INSERT INTO users (username, phone_number, password_hash, full_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, phone_number, full_name, password_hash
    `, [testUser.username, testUser.phone_number, testUser.password, testUser.full_name]);

    console.log('✅ تم إنشاء المستخدم:', {
      id: insertResult.rows[0].id,
      username: insertResult.rows[0].username,
      full_name: insertResult.rows[0].full_name,
      password_stored: insertResult.rows[0].password_hash
    });

    // اختبار البحث عن المستخدم
    console.log('🔍 اختبار البحث عن المستخدم...');
    const searchResult = await pool.query(`
      SELECT id, username, phone_number, password_hash, full_name
      FROM users WHERE username = $1
    `, [testUser.username]);

    if (searchResult.rows.length > 0) {
      const user = searchResult.rows[0];
      console.log('✅ تم العثور على المستخدم:', {
        username: user.username,
        full_name: user.full_name,
        password_stored: user.password_hash,
        password_matches: user.password_hash === testUser.password
      });
    }

    // اختبار تسجيل الدخول
    console.log('🔐 اختبار تسجيل الدخول...');
    const loginResult = await pool.query(`
      SELECT id, username, phone_number, password_hash, full_name, is_active
      FROM users WHERE username = $1 AND password_hash = $2
    `, [testUser.username, testUser.password]);

    if (loginResult.rows.length > 0) {
      console.log('✅ تسجيل الدخول ناجح:', {
        username: loginResult.rows[0].username,
        full_name: loginResult.rows[0].full_name,
        is_active: loginResult.rows[0].is_active
      });
    } else {
      console.log('❌ فشل تسجيل الدخول');
    }

    // عرض جميع المستخدمين
    console.log('📊 جميع المستخدمين في قاعدة البيانات:');
    const allUsers = await pool.query(`
      SELECT username, full_name, phone_number, password_hash, is_active, created_at
      FROM users ORDER BY created_at DESC
    `);

    allUsers.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} - ${user.full_name} - ${user.phone_number} - كلمة المرور: ${user.password_hash}`);
    });

    console.log('🎉 اختبار نظام المصادقة مكتمل!');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  } finally {
    await pool.end();
  }
}

testAuth();
