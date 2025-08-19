require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function fixTableStructure() {
  console.log('🔧 إصلاح هيكل جدول المنتجات...\n');

  try {
    const pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();
    console.log('✅ تم الاتصال بقاعدة البيانات');

    // إضافة عمود is_active إذا لم يكن موجوداً
    console.log('\n📝 إضافة عمود is_active...');
    try {
      await client.query(`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
      `);
      console.log('✅ تم إضافة عمود is_active بنجاح');
    } catch (error) {
      console.log('ℹ️ عمود is_active موجود بالفعل');
    }

    // تحديث البيانات الموجودة
    console.log('\n📝 تحديث البيانات الموجودة...');
    await client.query(`
      UPDATE products 
      SET is_active = true 
      WHERE is_active IS NULL;
    `);
    console.log('✅ تم تحديث البيانات الموجودة');

    // عرض الهيكل الجديد
    console.log('\n📋 هيكل الجدول بعد الإصلاح:');
    const schema = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position;
    `);
    
    schema.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}) ${row.column_default ? `DEFAULT: ${row.column_default}` : ''}`);
    });

    // اختبار إضافة منتج تجريبي
    console.log('\n🧪 اختبار إضافة منتج تجريبي...');
    const testProduct = {
      name: 'منتج تجريبي بعد الإصلاح',
      price: 1000,
      stock_quantity: 15,
      description: 'منتج تجريبي بعد إصلاح هيكل الجدول',
      images: ['https://example.com/test1.jpg', 'https://example.com/test2.jpg'],
      sizes: ['S', 'M', 'L'],
      discount_price: 800,
      is_active: true
    };
    
    const insertResult = await client.query(
      `INSERT INTO products (
        name, description, price, discount_price, 
        stock_quantity, sizes, images, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        testProduct.name,
        testProduct.description,
        testProduct.price,
        testProduct.discount_price,
        testProduct.stock_quantity,
        JSON.stringify(testProduct.sizes),
        JSON.stringify(testProduct.images),
        testProduct.is_active
      ]
    );
    
    console.log('✅ تم إضافة المنتج التجريبي بنجاح!');
    console.log(`📋 معرف المنتج: ${insertResult.rows[0].id}`);
    console.log(`📊 عدد الصور: ${insertResult.rows[0].images ? insertResult.rows[0].images.length : 0}`);
    console.log(`📊 المقاسات: ${insertResult.rows[0].sizes ? insertResult.rows[0].sizes.join(', ') : 'غير متوفرة'}`);
    console.log(`📊 نشط: ${insertResult.rows[0].is_active ? 'نعم' : 'لا'}`);
    
    // حذف المنتج التجريبي
    console.log('\n🗑️ حذف المنتج التجريبي...');
    await client.query('DELETE FROM products WHERE id = $1', [insertResult.rows[0].id]);
    console.log('✅ تم حذف المنتج التجريبي بنجاح!');

    client.release();
    await pool.end();
    console.log('\n✅ تم إغلاق الاتصال بقاعدة البيانات بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    console.error('🔍 تفاصيل الخطأ:', error);
  }
}

fixTableStructure();
