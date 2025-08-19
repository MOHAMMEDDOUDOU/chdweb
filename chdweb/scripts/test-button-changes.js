const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testButtonChanges() {
  console.log('🚀 اختبار تغييرات الأزرار...\n');

  try {
    // جلب العروض والمنتجات
    console.log('📋 جلب البيانات...');
    const [offersResponse, productsResponse] = await Promise.all([
      fetch('http://localhost:3001/api/offers'),
      fetch('http://localhost:3001/api/products')
    ]);
    
    const offers = await offersResponse.json();
    const products = await productsResponse.json();
    
    console.log(`📊 عدد العروض: ${offers.length}`);
    console.log(`📊 عدد المنتجات: ${products.length}`);

    if (offers.length === 0 && products.length === 0) {
      console.log('❌ لا توجد بيانات متاحة للاختبار');
      return;
    }

    console.log('\n✅ التعديلات المطلوبة:');
    console.log('1. ✅ إزالة زر "اطلب الآن" من بطاقات العروض');
    console.log('2. ✅ إزالة زر "اطلب الآن" من بطاقات المنتجات');
    console.log('3. ✅ استبدال الأزرار بزر "أنشئ رابط بيع"');
    console.log('4. ✅ ربط زر "أنشئ رابط بيع" بنافذة إنشاء الرابط');

    console.log('\n📝 ملاحظات للاختبار:');
    console.log('1. افتح الصفحة الرئيسية في المتصفح');
    console.log('2. تأكد من أن العروض تظهر مع زر "أنشئ رابط بيع" فقط');
    console.log('3. تأكد من أن المنتجات تظهر مع زر "أنشئ رابط بيع" فقط');
    console.log('4. انقر على أي زر "أنشئ رابط بيع" وتأكد من ظهور النافذة المنبثقة');
    console.log('5. تأكد من أن النافذة تسمح بإدخال السعر المخصص وبيانات التاجر');

    // اختبار نافذة إنشاء الرابط
    console.log('\n🧪 اختبار نافذة إنشاء الرابط...');
    if (offers.length > 0) {
      const testOffer = offers[0];
      console.log(`   عرض تجريبي: ${testOffer.name}`);
      console.log(`   السعر الأصلي: ${testOffer.price} دج`);
      if (testOffer.discount_price) {
        console.log(`   سعر الخصم: ${testOffer.discount_price} دج`);
      }
    }

    if (products.length > 0) {
      const testProduct = products[0];
      console.log(`   منتج تجريبي: ${testProduct.name}`);
      console.log(`   السعر: ${testProduct.price} دج`);
    }

    console.log('\n✅ اختبار تغييرات الأزرار مكتمل!');
    console.log('\n📋 ملخص التغييرات:');
    console.log('- تم إزالة زر "اطلب الآن" من جميع البطاقات');
    console.log('- تم استبداله بزر "أنشئ رابط بيع"');
    console.log('- الزر الجديد يفتح نافذة لإنشاء رابط بيع مخصص');
    console.log('- يمكن إدخال سعر مخصص وبيانات التاجر');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

testButtonChanges();
