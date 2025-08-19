require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  console.log('🔍 اختبار الاتصال بقاعدة بيانات Neon...');
  
  if (!process.env.NEON_DATABASE_URL) {
    console.error('❌ متغير NEON_DATABASE_URL غير موجود في ملف .env.local');
    console.log('📝 يرجى إضافة المتغير التالي إلى ملف .env.local:');
    console.log('NEON_DATABASE_URL=postgresql://username:password@ep-late-wildflower-66957205.us-east-1.aws.neon.tech/database?sslmode=require');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // اختبار الاتصال
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    
    console.log('✅ الاتصال ناجح!');
    console.log('🕐 الوقت الحالي:', result.rows[0].current_time);
    console.log('📊 إصدار قاعدة البيانات:', result.rows[0].db_version.split(' ')[0]);
    
    // اختبار وجود جدول المنتجات
    const tableResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `);
    
    if (tableResult.rows[0].exists) {
      console.log('✅ جدول المنتجات موجود');
      
      // عدد المنتجات
      const countResult = await pool.query('SELECT COUNT(*) as count FROM products');
      console.log('📦 عدد المنتجات:', countResult.rows[0].count);
    } else {
      console.log('⚠️  جدول المنتجات غير موجود');
      console.log('📝 يرجى تشغيل محتوى ملف database/schema.sql في SQL Editor');
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error.message);
    console.log('🔧 تأكد من:');
    console.log('   - صحة رابط الاتصال');
    console.log('   - إضافة sslmode=require');
    console.log('   - صحة اسم المستخدم وكلمة المرور');
  } finally {
    await pool.end();
  }
}

testConnection();
