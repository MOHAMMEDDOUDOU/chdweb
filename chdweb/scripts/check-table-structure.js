require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function checkTableStructure() {
  console.log('🔍 التحقق من هيكل جدول المنتجات...\n');

  try {
    const pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();
    console.log('✅ تم الاتصال بقاعدة البيانات');

    // التحقق من وجود الجدول
    console.log('\n📝 التحقق من وجود جدول المنتجات...');
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'products'
      );
    `);
    
    if (tableExists.rows[0].exists) {
      console.log('✅ جدول المنتجات موجود');
    } else {
      console.log('❌ جدول المنتجات غير موجود');
      return;
    }

    // عرض هيكل الجدول
    console.log('\n📋 هيكل جدول المنتجات:');
    const schema = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position;
    `);
    
    schema.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}) ${row.column_default ? `DEFAULT: ${row.column_default}` : ''}`);
    });

    // عرض البيانات الحالية
    console.log('\n📊 البيانات الحالية في الجدول:');
    const data = await client.query('SELECT * FROM products LIMIT 3');
    console.log(`عدد المنتجات: ${data.rows.length}`);
    
    if (data.rows.length > 0) {
      console.log('أول منتج:');
      console.log(JSON.stringify(data.rows[0], null, 2));
    }

    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

checkTableStructure();
