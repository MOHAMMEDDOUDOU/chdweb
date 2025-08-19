const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

// تكوين Supabase (البيانات الحالية)
const supabaseUrl = 'https://jftramutcivefgkdorhy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdHJhbXV0Y2l2ZWZna2Rvcmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MTcyNTMsImV4cCI6MjA3MDE5MzI1M30.5k0UGACllZojdNJrQItynlAthFGjcMZeAjsbxQjpvmg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

require('dotenv').config();

// تكوين Neon (الجديد)
const neonPool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrateProducts() {
  try {
    console.log('بدء نقل البيانات من Supabase إلى Neon...');

    // جلب جميع المنتجات من Supabase
    console.log('جلب المنتجات من Supabase...');
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`خطأ في جلب البيانات من Supabase: ${error.message}`);
    }

    console.log(`تم العثور على ${products.length} منتج`);

    // نقل كل منتج إلى Neon
    for (const product of products) {
      console.log(`نقل المنتج: ${product.name}`);
      
      const result = await neonPool.query(
        `INSERT INTO products (
          id, name, description, price, discount_price, discount_percentage,
          image_url, stock_quantity, sizes, images, category, is_active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO NOTHING`,
        [
          product.id,
          product.name,
          product.description,
          product.price,
          product.discount_price,
          product.discount_percentage,
          product.image_url,
          product.stock_quantity,
          product.sizes ? JSON.stringify(product.sizes) : null,
          product.images ? JSON.stringify(product.images) : null,
          product.category,
          product.is_active,
          product.created_at,
          product.updated_at || product.created_at
        ]
      );

      if (result.rowCount > 0) {
        console.log(`✓ تم نقل المنتج: ${product.name}`);
      } else {
        console.log(`- المنتج موجود مسبقاً: ${product.name}`);
      }
    }

    console.log('✅ تم نقل جميع المنتجات بنجاح!');

    // التحقق من عدد المنتجات في Neon
    const countResult = await neonPool.query('SELECT COUNT(*) FROM products');
    console.log(`إجمالي المنتجات في Neon: ${countResult.rows[0].count}`);

  } catch (error) {
    console.error('❌ خطأ في نقل البيانات:', error);
  } finally {
    await neonPool.end();
  }
}

// تشغيل النقل إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  if (!process.env.NEON_DATABASE_URL) {
    console.error('❌ يرجى تعيين متغير NEON_DATABASE_URL');
    process.exit(1);
  }
  
  migrateProducts();
}

module.exports = { migrateProducts };
