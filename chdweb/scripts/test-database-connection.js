const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testDatabaseConnection() {
  console.log('🚀 اختبار اتصال قاعدة البيانات...\n');

  try {
    // اختبار 1: جلب المنتجات الحالية
    console.log('📝 اختبار 1: جلب المنتجات الحالية');
    const productsResponse = await fetch('http://localhost:3001/api/products');
    
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      console.log('✅ تم جلب المنتجات بنجاح!');
      console.log(`📊 عدد المنتجات: ${products.length}`);
      
      if (products.length > 0) {
        console.log('📋 تفاصيل أول منتج:');
        console.log(JSON.stringify(products[0], null, 2));
      }
    } else {
      const error = await productsResponse.text();
      console.log('❌ فشل في جلب المنتجات');
      console.log(`🔍 تفاصيل الخطأ: ${error}`);
    }

    // اختبار 2: جلب العروض
    console.log('\n📝 اختبار 2: جلب العروض');
    const offersResponse = await fetch('http://localhost:3001/api/offers');
    
    if (offersResponse.ok) {
      const offers = await offersResponse.json();
      console.log('✅ تم جلب العروض بنجاح!');
      console.log(`📊 عدد العروض: ${offers.length}`);
    } else {
      const error = await offersResponse.text();
      console.log('❌ فشل في جلب العروض');
      console.log(`🔍 تفاصيل الخطأ: ${error}`);
    }

    // اختبار 3: جلب الطلبات
    console.log('\n📝 اختبار 3: جلب الطلبات');
    const ordersResponse = await fetch('http://localhost:3001/api/orders');
    
    if (ordersResponse.ok) {
      const orders = await ordersResponse.json();
      console.log('✅ تم جلب الطلبات بنجاح!');
      console.log(`📊 عدد الطلبات: ${orders.length}`);
    } else {
      const error = await ordersResponse.text();
      console.log('❌ فشل في جلب الطلبات');
      console.log(`🔍 تفاصيل الخطأ: ${error}`);
    }

    // اختبار 4: اختبار إضافة منتج بسيط جداً
    console.log('\n📝 اختبار 4: إضافة منتج بسيط جداً');
    const simpleProduct = {
      name: "منتج اختبار بسيط",
      price: 100,
      stock_quantity: 10
    };

    const addResponse = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simpleProduct)
    });

    if (addResponse.ok) {
      const result = await addResponse.json();
      console.log('✅ تم إضافة المنتج البسيط بنجاح!');
      console.log(`📋 معرف المنتج: ${result.id}`);
      
      // حذف المنتج التجريبي
      console.log('🗑️ حذف المنتج التجريبي...');
      const deleteResponse = await fetch(`http://localhost:3001/api/products/${result.id}`, {
        method: 'DELETE'
      });
      
      if (deleteResponse.ok) {
        console.log('✅ تم حذف المنتج التجريبي بنجاح!');
      } else {
        console.log('⚠️ فشل في حذف المنتج التجريبي');
      }
    } else {
      const error = await addResponse.text();
      console.log('❌ فشل في إضافة المنتج البسيط');
      console.log(`🔍 تفاصيل الخطأ: ${error}`);
      
      // محاولة تحليل الخطأ
      try {
        const errorObj = JSON.parse(error);
        console.log('🔍 تحليل الخطأ:');
        console.log(JSON.stringify(errorObj, null, 2));
      } catch (e) {
        console.log('🔍 الخطأ ليس بتنسيق JSON');
      }
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
    console.error('🔍 تفاصيل الخطأ:', error);
  }
}

testDatabaseConnection();
