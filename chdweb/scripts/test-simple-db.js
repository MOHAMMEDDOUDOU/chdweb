const { Pool } = require('pg');

async function testSimpleDatabase() {
  console.log('🚀 اختبار قاعدة البيانات المبسط...\n');

  try {
    // إنشاء اتصال
    const pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('📝 اختبار الاتصال بقاعدة البيانات...');
    const client = await pool.connect();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!');
    
    // اختبار جلب المنتجات
    console.log('\n📝 اختبار جلب المنتجات...');
    const productsResult = await client.query('SELECT * FROM products ORDER BY created_at DESC LIMIT 5');
    console.log(`✅ تم جلب ${productsResult.rows.length} منتج`);
    
    if (productsResult.rows.length > 0) {
      console.log('📋 تفاصيل أول منتج:');
      console.log(JSON.stringify(productsResult.rows[0], null, 2));
    }
    
    // اختبار إضافة منتج تجريبي
    console.log('\n📝 اختبار إضافة منتج تجريبي...');
    const testProduct = {
      id: `test-${Date.now()}`,
      name: 'منتج تجريبي مباشر',
      price: 500,
      stock_quantity: 10,
      description: 'منتج تجريبي من قاعدة البيانات مباشرة',
      images: JSON.stringify(['https://example.com/test1.jpg', 'https://example.com/test2.jpg']),
      sizes: JSON.stringify(['S', 'M', 'L']),
      discount_price: 400,
      is_active: true
    };
    
    const insertResult = await client.query(
      `INSERT INTO products (
        id, name, description, price, discount_price, 
        stock_quantity, sizes, images, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        testProduct.id,
        testProduct.name,
        testProduct.description,
        testProduct.price,
        testProduct.discount_price,
        testProduct.stock_quantity,
        testProduct.sizes,
        testProduct.images,
        testProduct.is_active
      ]
    );
    
    console.log('✅ تم إضافة المنتج التجريبي بنجاح!');
    console.log(`📋 معرف المنتج: ${insertResult.rows[0].id}`);
    console.log(`📊 عدد الصور: ${insertResult.rows[0].images ? JSON.parse(insertResult.rows[0].images).length : 0}`);
    console.log(`📊 المقاسات: ${insertResult.rows[0].sizes ? JSON.parse(insertResult.rows[0].sizes).join(', ') : 'غير متوفرة'}`);
    
    // حذف المنتج التجريبي
    console.log('\n🗑️ حذف المنتج التجريبي...');
    await client.query('DELETE FROM products WHERE id = $1', [testProduct.id]);
    console.log('✅ تم حذف المنتج التجريبي بنجاح!');
    
    // اختبار هيكل الجدول
    console.log('\n📝 اختبار هيكل جدول المنتجات...');
    const schemaResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 هيكل جدول المنتجات:');
    schemaResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    client.release();
    await pool.end();
    console.log('\n✅ تم إغلاق الاتصال بقاعدة البيانات بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في اختبار قاعدة البيانات:', error.message);
    console.error('🔍 تفاصيل الخطأ:', error);
  }
}

testSimpleDatabase();
