const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// إنشاء اتصال SQLite
const dbPath = path.join(__dirname, '../database/test.db');
const db = new sqlite3.Database(dbPath);

async function testAddOfferSQLite() {
  try {
    console.log('🚀 بدء اختبار إضافة عرض جديد باستخدام SQLite...');
    console.log('📁 مسار قاعدة البيانات:', dbPath);
    
    // إنشاء جدول العروض إذا لم يكن موجوداً
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS offers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          discount_price REAL,
          image_url TEXT,
          stock_quantity INTEGER NOT NULL DEFAULT 0,
          sizes TEXT,
          images TEXT,
          category TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ تم إنشاء جدول العروض بنجاح');

    // بيانات العرض الجديد
    const newOffer = {
      name: 'عرض خاص - مجموعة ماكياج كاملة',
      description: 'مجموعة ماكياج احترافية تتضمن أحمر شفاه، كحل، وماسكارا بجودة عالية',
      price: 2500.00,
      discount_price: 1800.00,
      image_url: 'https://example.com/makeup-set.jpg',
      stock_quantity: 50,
      sizes: JSON.stringify(['صغير', 'متوسط', 'كبير']),
      images: JSON.stringify([
        'https://example.com/makeup-set-1.jpg',
        'https://example.com/makeup-set-2.jpg',
        'https://example.com/makeup-set-3.jpg'
      ]),
      category: 'Maquillage'
    };

    console.log('📝 بيانات العرض المراد إضافته:', JSON.stringify(newOffer, null, 2));

    // إضافة العرض
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO offers (
          name, description, price, discount_price, image_url, stock_quantity, sizes, images, category
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        newOffer.name,
        newOffer.description,
        newOffer.price,
        newOffer.discount_price,
        newOffer.image_url,
        newOffer.stock_quantity,
        newOffer.sizes,
        newOffer.images,
        newOffer.category
      ], function(err) {
        if (err) reject(err);
        else {
          console.log('✅ تم إضافة العرض بنجاح!');
          console.log('🆔 معرف العرض:', this.lastID);
          resolve(this.lastID);
        }
      });
    });

    // التحقق من إضافة العرض
    const verification = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM offers WHERE name = ? ORDER BY created_at DESC LIMIT 1',
        [newOffer.name],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (verification) {
      console.log('✅ تم التحقق من إضافة العرض في قاعدة البيانات');
      console.log('📊 تفاصيل العرض المضاف:', JSON.stringify(verification, null, 2));
    } else {
      console.log('❌ لم يتم العثور على العرض في قاعدة البيانات');
    }

    // عرض إحصائيات العروض
    const stats = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as total_offers FROM offers', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    console.log('📈 إجمالي عدد العروض في قاعدة البيانات:', stats.total_offers);

    // عرض آخر 3 عروض
    const recentOffers = await new Promise((resolve, reject) => {
      db.all(
        'SELECT id, name, price, category, created_at FROM offers ORDER BY created_at DESC LIMIT 3',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    console.log('🆕 آخر 3 عروض:', JSON.stringify(recentOffers, null, 2));

    // اختبار إضافة عرض آخر
    const secondOffer = {
      name: 'عرض العطور الفاخرة',
      description: 'مجموعة عطور فاخرة من أفضل الماركات العالمية',
      price: 3500.00,
      discount_price: 2800.00,
      image_url: 'https://example.com/perfume-set.jpg',
      stock_quantity: 25,
      sizes: JSON.stringify(['30ml', '50ml', '100ml']),
      images: JSON.stringify([
        'https://example.com/perfume-1.jpg',
        'https://example.com/perfume-2.jpg'
      ]),
      category: 'Parfums'
    };

    console.log('\n🔄 إضافة عرض ثاني للاختبار...');
    
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO offers (
          name, description, price, discount_price, image_url, stock_quantity, sizes, images, category
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        secondOffer.name,
        secondOffer.description,
        secondOffer.price,
        secondOffer.discount_price,
        secondOffer.image_url,
        secondOffer.stock_quantity,
        secondOffer.sizes,
        secondOffer.images,
        secondOffer.category
      ], function(err) {
        if (err) reject(err);
        else {
          console.log('✅ تم إضافة العرض الثاني بنجاح!');
          console.log('🆔 معرف العرض الثاني:', this.lastID);
          resolve(this.lastID);
        }
      });
    });

    // عرض جميع العروض
    const allOffers = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM offers ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    console.log('\n📋 جميع العروض في قاعدة البيانات:', JSON.stringify(allOffers, null, 2));

  } catch (error) {
    console.error('❌ خطأ في إضافة العرض:', error);
    console.error('🔍 تفاصيل الخطأ:', error.message);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('❌ خطأ في إغلاق قاعدة البيانات:', err.message);
      } else {
        console.log('🔚 تم إغلاق الاتصال بقاعدة البيانات');
      }
    });
  }
}

// تشغيل الاختبار
testAddOfferSQLite();
