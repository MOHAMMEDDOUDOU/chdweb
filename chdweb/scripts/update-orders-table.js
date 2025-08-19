require('dotenv').config();
const { Pool } = require('pg');

async function updateOrdersTable() {
  console.log('🔧 تحديث جدول الطلبات...');
  
  if (!process.env.NEON_DATABASE_URL) {
    console.error('❌ متغير NEON_DATABASE_URL غير موجود');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // إضافة الأعمدة الجديدة إذا لم تكن موجودة
    console.log('➕ إضافة أعمدة إعادة البيع...');
    
    await pool.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS reseller_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS reseller_phone VARCHAR(30),
      ADD COLUMN IF NOT EXISTS reseller_user_id UUID;
    `);
    console.log('✅ تم إضافة أعمدة إعادة البيع');

    // إنشاء فهرس جديد
    console.log('🔧 إنشاء فهرس إعادة البيع...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_reseller ON orders(reseller_user_id);
    `);
    console.log('✅ تم إنشاء فهرس إعادة البيع');

    // التحقق من هيكل الجدول
    console.log('📊 التحقق من هيكل جدول الطلبات...');
    const columnsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'orders' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 أعمدة جدول الطلبات:');
    columnsResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    console.log('🎉 تم تحديث جدول الطلبات بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في تحديث جدول الطلبات:', error.message);
  } finally {
    await pool.end();
  }
}

updateOrdersTable();
