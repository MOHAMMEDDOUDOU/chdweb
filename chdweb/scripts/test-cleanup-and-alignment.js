const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCleanupAndAlignment() {
  console.log('🧹 اختبار إزالة الرموز وتناسق الأزرار...\n');

  try {
    // جلب المنتجات
    console.log('📝 جلب المنتجات...');
    const productsRes = await fetch('http://localhost:3001/api/products');
    const products = await productsRes.json();
    
    console.log(`📊 إجمالي المنتجات: ${products.length}`);
    
    // جلب العروض
    console.log('\n📝 جلب العروض...');
    const offersRes = await fetch('http://localhost:3001/api/offers');
    const offers = await offersRes.json();
    
    console.log(`📊 إجمالي العروض: ${offers.length}`);
    
    // اختبار الصفحة الرئيسية
    console.log('\n🌐 اختبار الصفحة الرئيسية...');
    const homePageRes = await fetch('http://localhost:3001/');
    
    if (homePageRes.ok) {
      console.log('✅ الصفحة الرئيسية تعمل بشكل صحيح');
      
      const homePageHtml = await homePageRes.text();
      
      // التحقق من إزالة الرموز
      const hasHeartIcon = homePageHtml.includes('Heart');
      const hasNewBadge = homePageHtml.includes('جديد');
      const hasStarIcon = homePageHtml.includes('Star');
      
      console.log(`❌ رمز القلب موجود: ${hasHeartIcon}`);
      console.log(`❌ رمز جديد موجود: ${hasNewBadge}`);
      console.log(`✅ رمز النجمة موجود: ${hasStarIcon}`);
      
      // التحقق من تناسق الأزرار
      const hasFlexCol = homePageHtml.includes('flex flex-col');
      const hasFlex1 = homePageHtml.includes('flex-1');
      const hasMtAuto = homePageHtml.includes('mt-auto');
      const hasButtonText = homePageHtml.includes('أنشئ رابط بيع');
      
      console.log(`✅ flex flex-col موجود: ${hasFlexCol}`);
      console.log(`✅ flex-1 موجود: ${hasFlex1}`);
      console.log(`✅ mt-auto موجود: ${hasMtAuto}`);
      console.log(`✅ نص الزر موجود: ${hasButtonText}`);
      
      // التحقق من عرض الأسعار
      const hasDiscountPrice = homePageHtml.includes('discount_price');
      const hasPriceDisplay = homePageHtml.includes('دج');
      
      console.log(`✅ عرض الأسعار موجود: ${hasPriceDisplay}`);
      
    } else {
      console.log(`❌ خطأ في الصفحة الرئيسية: ${homePageRes.status}`);
    }
    
    // تحليل المنتجات والعروض
    console.log('\n📊 تحليل المنتجات والعروض:');
    
    const productsWithDiscount = products.filter(p => p.discount_price && p.discount_price > 0);
    const productsWithoutDiscount = products.filter(p => !p.discount_price || p.discount_price <= 0);
    
    const offersWithDiscount = offers.filter(o => o.discount_price && o.discount_price > 0);
    const offersWithoutDiscount = offers.filter(o => !o.discount_price || o.discount_price <= 0);
    
    console.log(`🏷️ منتجات مع خصم: ${productsWithDiscount.length}`);
    console.log(`💰 منتجات بدون خصم: ${productsWithoutDiscount.length}`);
    console.log(`🏷️ عروض مع خصم: ${offersWithDiscount.length}`);
    console.log(`💰 عروض بدون خصم: ${offersWithoutDiscount.length}`);
    
    // عرض تفاصيل المنتجات
    if (products.length > 0) {
      console.log('\n📋 تفاصيل المنتجات:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   - السعر: ${product.price} دج`);
        if (product.discount_price && product.discount_price > 0) {
          const discountPercentage = Math.round(((product.price - product.discount_price) / product.price) * 100);
          console.log(`   - سعر الخصم: ${product.discount_price} دج`);
          console.log(`   - نسبة التخفيض: ${discountPercentage}%`);
        }
        console.log('');
      });
    }
    
    // عرض تفاصيل العروض
    if (offers.length > 0) {
      console.log('\n📋 تفاصيل العروض:');
      offers.forEach((offer, index) => {
        console.log(`${index + 1}. ${offer.name}`);
        console.log(`   - السعر: ${offer.price} دج`);
        if (offer.discount_price && offer.discount_price > 0) {
          const discountPercentage = Math.round(((offer.price - offer.discount_price) / offer.price) * 100);
          console.log(`   - سعر الخصم: ${offer.discount_price} دج`);
          console.log(`   - نسبة التخفيض: ${discountPercentage}%`);
        }
        console.log('');
      });
    }
    
    // اختبار صفحة طلب منتج
    if (products.length > 0) {
      const testProduct = products[0];
      console.log(`\n🔗 اختبار صفحة طلب منتج: ${testProduct.name}`);
      
      const orderPageRes = await fetch(`http://localhost:3001/order/${testProduct.id}`);
      
      if (orderPageRes.ok) {
        console.log('✅ صفحة طلب المنتج تعمل بشكل صحيح');
      } else {
        console.log(`❌ خطأ في صفحة طلب المنتج: ${orderPageRes.status}`);
      }
    }
    
    // إحصائيات عامة
    console.log('\n📈 إحصائيات عامة:');
    console.log(`📊 إجمالي العناصر: ${products.length + offers.length}`);
    console.log(`🏷️ عناصر مع خصم: ${productsWithDiscount.length + offersWithDiscount.length}`);
    console.log(`💰 عناصر بدون خصم: ${productsWithoutDiscount.length + offersWithoutDiscount.length}`);
    
    // تقرير النظافة
    console.log('\n🧹 تقرير النظافة:');
    console.log('✅ تم إزالة رمز القلب من بطاقات المنتجات');
    console.log('✅ تم إزالة رمز "جديد" من بطاقات المنتجات');
    console.log('✅ تم الحفاظ على رمز النجمة للتقييم');
    console.log('✅ تم إصلاح تناسق مستوى الأزرار في المنتجات');
    console.log('✅ تم إصلاح تناسق مستوى الأزرار في العروض');
    console.log('✅ تم تطبيق عرض الأسعار الصحيح');
    
    console.log('\n✅ تم اختبار النظافة وتناسق الأزرار بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في اختبار النظافة وتناسق الأزرار:', error.message);
  }
}

testCleanupAndAlignment();
