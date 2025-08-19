const { Pool } = require('pg');

// تكوين الاتصال بقاعدة البيانات
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/chdweb',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testAddOffer() {
  try {
    console.log('🚀 بدء اختبار إضافة عرض جديد...');
    
    // بيانات العرض الجديد
    const newOffer = {
      name: 'عرض خاص - مجموعة ماكياج كاملة',
      description: 'مجموعة ماكياج احترافية تتضمن أحمر شفاه، كحل، وماسكارا بجودة عالية',
      price: 2500.00,
      discount_price: 1800.00,
      image_url: 'https://example.com/makeup-set.jpg',
      stock_quantity: 50,
      sizes: ['صغير', 'متوسط', 'كبير'],
      images: [
        'https://example.com/makeup-set-1.jpg',
        'https://example.com/makeup-set-2.jpg',
        'https://example.com/makeup-set-3.jpg'
      ],
      category: 'Maquillage'
    };

    console.log('📝 بيانات العرض المراد إضافته:', JSON.stringify(newOffer, null, 2));

    // إضافة العرض
    const result = await pool.query(
      `INSERT INTO offers (
        name, description, price, discount_price, image_url, stock_quantity, sizes, images, category
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        newOffer.name,
        newOffer.description,
        newOffer.price,
        newOffer.discount_price,
        newOffer.image_url,
        newOffer.stock_quantity,
        JSON.stringify(newOffer.sizes),
        JSON.stringify(newOffer.images),
        newOffer.category
      ]
    );

    console.log('✅ تم إضافة العرض بنجاح!');
    console.log('📊 تفاصيل العرض المضاف:', JSON.stringify(result.rows[0], null, 2));

    // التحقق من إضافة العرض
    const verification = await pool.query(
      'SELECT * FROM offers WHERE name = $1 ORDER BY created_at DESC LIMIT 1',
      [newOffer.name]
    );

    if (verification.rows.length > 0) {
      console.log('✅ تم التحقق من إضافة العرض في قاعدة البيانات');
      console.log('🆔 معرف العرض:', verification.rows[0].id);
    } else {
      console.log('❌ لم يتم العثور على العرض في قاعدة البيانات');
    }

    // عرض إحصائيات العروض
    const stats = await pool.query('SELECT COUNT(*) as total_offers FROM offers');
    console.log('📈 إجمالي عدد العروض في قاعدة البيانات:', stats.rows[0].total_offers);

    // عرض آخر 3 عروض
    const recentOffers = await pool.query('SELECT id, name, price, category, created_at FROM offers ORDER BY created_at DESC LIMIT 3');
    console.log('🆕 آخر 3 عروض:', JSON.stringify(recentOffers.rows, null, 2));

  } catch (error) {
    console.error('❌ خطأ في إضافة العرض:', error);
    console.error('🔍 تفاصيل الخطأ:', error.message);
    
    // محاولة تشخيص المشكلة
    if (error.code === '23505') {
      console.log('💡 المشكلة: تكرار في البيانات (unique constraint violation)');
    } else if (error.code === '23502') {
      console.log('💡 المشكلة: قيمة مطلوبة مفقودة (not null constraint violation)');
    } else if (error.code === '23503') {
      console.log('💡 المشكلة: مشكلة في المفاتيح الخارجية (foreign key constraint violation)');
    } else if (error.code === '42P01') {
      console.log('💡 المشكلة: جدول العروض غير موجود');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 المشكلة: لا يمكن الاتصال بقاعدة البيانات');
    }
  } finally {
    await pool.end();
    console.log('🔚 تم إغلاق الاتصال بقاعدة البيانات');
  }
}

// تشغيل الاختبار
testAddOffer();
