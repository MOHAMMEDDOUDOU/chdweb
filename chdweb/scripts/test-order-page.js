const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testOrderPage() {
  console.log('🚀 اختبار صفحة الطلب مع العروض...\n');

  try {
    // جلب العروض المتاحة
    console.log('📋 جلب العروض المتاحة...');
    const offersResponse = await fetch('http://localhost:3001/api/offers');
    const offers = await offersResponse.json();
    
    if (offers.length === 0) {
      console.log('❌ لا توجد عروض متاحة للاختبار');
      return;
    }

    // اختيار عرض مع صور للاختبار
    const offerWithImages = offers.find(offer => offer.images && offer.images.length > 0);
    const testOffer = offerWithImages || offers[0];

    console.log(`✅ تم اختيار العرض: ${testOffer.name}`);
    console.log(`📊 تفاصيل العرض:`);
    console.log(`   - السعر: ${testOffer.price} دج`);
    console.log(`   - سعر الخصم: ${testOffer.discount_price || 'غير متوفر'}`);
    console.log(`   - الوصف: ${testOffer.description || 'غير متوفر'}`);
    console.log(`   - المقاسات: ${testOffer.sizes ? testOffer.sizes.join(', ') : 'غير متوفرة'}`);
    console.log(`   - الصور: ${testOffer.images ? testOffer.images.length : 0} صورة`);

    // اختبار رابط الطلب للمنتج العادي
    const productUrl = `http://localhost:3001/order/${testOffer.id}`;
    console.log(`\n🔗 رابط الطلب للمنتج العادي: ${productUrl}`);

    // اختبار رابط الطلب للعرض
    const offerUrl = `http://localhost:3001/order/${testOffer.id}?type=offer`;
    console.log(`🔗 رابط الطلب للعرض: ${offerUrl}`);

    // اختبار رابط إعادة البيع
    const resellerUrl = `http://localhost:3001/order/${testOffer.id}?type=offer&price=${testOffer.discount_price || testOffer.price}&reseller_name=تاجر%20تجريبي&reseller_phone=0550123456`;
    console.log(`🔗 رابط إعادة البيع: ${resellerUrl}`);

    console.log('\n📝 ملاحظات للاختبار:');
    console.log('1. افتح الروابط في المتصفح لاختبار واجهة المستخدم');
    console.log('2. تأكد من أن معرض الصور يعمل بشكل صحيح');
    console.log('3. تأكد من عرض السعر والخصم بشكل صحيح');
    console.log('4. تأكد من عرض المقاسات إذا كانت متوفرة');
    console.log('5. تأكد من أن النموذج يعمل بشكل صحيح');

    // اختبار API الطلب
    console.log('\n🧪 اختبار API الطلب...');
    const testOrder = {
      item_type: 'offer',
      item_id: testOffer.id,
      item_name: testOffer.name,
      quantity: 1,
      unit_price: Number(testOffer.discount_price || testOffer.price),
      subtotal: Number(testOffer.discount_price || testOffer.price),
      shipping_cost: 500,
      total_amount: Number(testOffer.discount_price || testOffer.price) + 500,
      customer_name: 'مستخدم تجريبي',
      phone_number: '0550123456',
      wilaya: 'الجزائر',
      commune: 'الجزائر الوسطى',
      delivery_type: 'home',
      reseller_price: Number(testOffer.discount_price || testOffer.price),
      reseller_name: 'تاجر تجريبي',
      reseller_phone: '0550123456'
    };

    const orderResponse = await fetch('http://localhost:3001/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });

    if (orderResponse.ok) {
      const orderResult = await orderResponse.json();
      console.log('✅ تم إنشاء الطلب بنجاح!');
      console.log(`📋 رقم الطلب: ${orderResult.id}`);
    } else {
      console.log('❌ فشل في إنشاء الطلب');
      const errorText = await orderResponse.text();
      console.log(`🔍 تفاصيل الخطأ: ${errorText}`);
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

testOrderPage();
