const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAddProduct() {
  console.log('🚀 اختبار إضافة منتج والتحقق من الأخطاء...\n');

  try {
    // اختبار 1: إضافة منتج بسيط
    console.log('📝 اختبار 1: إضافة منتج بسيط');
    const simpleProduct = {
      name: "منتج تجريبي بسيط",
      price: 1500,
      stock_quantity: 50,
      description: "منتج تجريبي للاختبار",
      is_active: true
    };

    const response1 = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simpleProduct)
    });

    if (response1.ok) {
      const result1 = await response1.json();
      console.log('✅ تم إضافة المنتج البسيط بنجاح!');
      console.log(`📋 معرف المنتج: ${result1.id}`);
      console.log(`📊 تفاصيل المنتج:`, result1);
    } else {
      const error1 = await response1.text();
      console.log('❌ فشل في إضافة المنتج البسيط');
      console.log(`🔍 تفاصيل الخطأ: ${error1}`);
    }

    // اختبار 2: إضافة منتج مع خصم
    console.log('\n📝 اختبار 2: إضافة منتج مع خصم');
    const discountedProduct = {
      name: "منتج مخفض",
      price: 2000,
      discount_price: 1500,
      stock_quantity: 30,
      description: "منتج مع خصم 25%",
      is_active: true
    };

    const response2 = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discountedProduct)
    });

    if (response2.ok) {
      const result2 = await response2.json();
      console.log('✅ تم إضافة المنتج المخفض بنجاح!');
      console.log(`📋 معرف المنتج: ${result2.id}`);
      console.log(`📊 نسبة الخصم: ${Math.round(((result2.price - result2.discount_price) / result2.price) * 100)}%`);
    } else {
      const error2 = await response2.text();
      console.log('❌ فشل في إضافة المنتج المخفض');
      console.log(`🔍 تفاصيل الخطأ: ${error2}`);
    }

    // اختبار 3: إضافة منتج مع مقاسات
    console.log('\n📝 اختبار 3: إضافة منتج مع مقاسات');
    const sizedProduct = {
      name: "منتج بمقاسات",
      price: 800,
      stock_quantity: 100,
      sizes: ["S", "M", "L", "XL"],
      description: "منتج متوفر بمقاسات مختلفة",
      is_active: true
    };

    const response3 = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sizedProduct)
    });

    if (response3.ok) {
      const result3 = await response3.json();
      console.log('✅ تم إضافة المنتج بالمقاسات بنجاح!');
      console.log(`📋 معرف المنتج: ${result3.id}`);
      console.log(`📊 المقاسات المتوفرة: ${result3.sizes?.join(', ') || 'غير متوفرة'}`);
    } else {
      const error3 = await response3.text();
      console.log('❌ فشل في إضافة المنتج بالمقاسات');
      console.log(`🔍 تفاصيل الخطأ: ${error3}`);
    }

    // اختبار 4: إضافة منتج مع صور
    console.log('\n📝 اختبار 4: إضافة منتج مع صور');
    const productWithImages = {
      name: "منتج مصور",
      price: 1200,
      stock_quantity: 25,
      images: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg"
      ],
      description: "منتج مع صور متعددة",
      is_active: true
    };

    const response4 = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productWithImages)
    });

    if (response4.ok) {
      const result4 = await response4.json();
      console.log('✅ تم إضافة المنتج المصور بنجاح!');
      console.log(`📋 معرف المنتج: ${result4.id}`);
      console.log(`📊 عدد الصور: ${result4.images?.length || 0}`);
    } else {
      const error4 = await response4.text();
      console.log('❌ فشل في إضافة المنتج المصور');
      console.log(`🔍 تفاصيل الخطأ: ${error4}`);
    }

    // اختبار 5: إضافة منتج مع جميع الخصائص
    console.log('\n📝 اختبار 5: إضافة منتج شامل');
    const fullProduct = {
      name: "منتج شامل",
      price: 3000,
      discount_price: 2400,
      stock_quantity: 15,
      sizes: ["M", "L", "XL"],
      images: [
        "https://example.com/full-product-1.jpg",
        "https://example.com/full-product-2.jpg"
      ],
      description: "منتج شامل مع جميع الخصائص المتاحة",
      is_active: true
    };

    const response5 = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullProduct)
    });

    if (response5.ok) {
      const result5 = await response5.json();
      console.log('✅ تم إضافة المنتج الشامل بنجاح!');
      console.log(`📋 معرف المنتج: ${result5.id}`);
      console.log(`📊 نسبة الخصم: ${Math.round(((result5.price - result5.discount_price) / result5.price) * 100)}%`);
      console.log(`📊 المقاسات: ${result5.sizes?.join(', ') || 'غير متوفرة'}`);
      console.log(`📊 عدد الصور: ${result5.images?.length || 0}`);
    } else {
      const error5 = await response5.text();
      console.log('❌ فشل في إضافة المنتج الشامل');
      console.log(`🔍 تفاصيل الخطأ: ${error5}`);
    }

    // جلب جميع المنتجات للإحصائيات
    console.log('\n🔄 جلب جميع المنتجات للإحصائيات...');
    const productsResponse = await fetch('http://localhost:3001/api/products');
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      console.log(`📈 إجمالي عدد المنتجات: ${products.length}`);
      
      const productsWithDiscount = products.filter(p => p.discount_price);
      const productsWithSizes = products.filter(p => p.sizes && p.sizes.length > 0);
      const productsWithImages = products.filter(p => p.images && p.images.length > 0);
      
      console.log(`📊 منتجات مع خصم: ${productsWithDiscount.length}`);
      console.log(`📊 منتجات مع مقاسات: ${productsWithSizes.length}`);
      console.log(`📊 منتجات مع صور: ${productsWithImages.length}`);
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

testAddProduct();
