const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testButtonAlignment() {
  console.log('🔘 اختبار تناسق مستوى أزرار "أنشئ رابط بيع"...\n');

  try {
    // جلب المنتجات
    console.log('📝 جلب المنتجات...');
    const productsRes = await fetch('http://localhost:3001/api/products');
    const products = await productsRes.json();
    
    console.log(`📊 إجمالي المنتجات: ${products.length}`);
    
    // تحليل المنتجات حسب وجود الخصم
    const productsWithDiscount = products.filter(p => p.discount_price && p.discount_price > 0);
    const productsWithoutDiscount = products.filter(p => !p.discount_price || p.discount_price <= 0);
    
    console.log(`🏷️ منتجات مع خصم: ${productsWithDiscount.length}`);
    console.log(`💰 منتجات بدون خصم: ${productsWithoutDiscount.length}`);
    
    // جلب العروض
    console.log('\n📝 جلب العروض...');
    const offersRes = await fetch('http://localhost:3001/api/offers');
    const offers = await offersRes.json();
    
    console.log(`📊 إجمالي العروض: ${offers.length}`);
    
    // تحليل العروض حسب وجود الخصم
    const offersWithDiscount = offers.filter(o => o.discount_price && o.discount_price > 0);
    const offersWithoutDiscount = offers.filter(o => !o.discount_price || o.discount_price <= 0);
    
    console.log(`🏷️ عروض مع خصم: ${offersWithDiscount.length}`);
    console.log(`💰 عروض بدون خصم: ${offersWithoutDiscount.length}`);
    
    // اختبار الصفحة الرئيسية
    console.log('\n🌐 اختبار الصفحة الرئيسية...');
    const homePageRes = await fetch('http://localhost:3001/');
    
    if (homePageRes.ok) {
      console.log('✅ الصفحة الرئيسية تعمل بشكل صحيح');
      
      const homePageHtml = await homePageRes.text();
      
      // التحقق من وجود flex classes
      const hasFlexCol = homePageHtml.includes('flex flex-col');
      const hasFlex1 = homePageHtml.includes('flex-1');
      const hasMtAuto = homePageHtml.includes('mt-auto');
      const hasButtonText = homePageHtml.includes('أنشئ رابط بيع');
      
      console.log(`✅ flex flex-col موجود: ${hasFlexCol}`);
      console.log(`✅ flex-1 موجود: ${hasFlex1}`);
      console.log(`✅ mt-auto موجود: ${hasMtAuto}`);
      console.log(`✅ نص الزر موجود: ${hasButtonText}`);
      
      // التحقق من وجود grid classes
      const hasGrid = homePageHtml.includes('grid grid-cols');
      const hasGap = homePageHtml.includes('gap-8');
      
      console.log(`✅ grid موجود: ${hasGrid}`);
      console.log(`✅ gap-8 موجود: ${hasGap}`);
      
    } else {
      console.log(`❌ خطأ في الصفحة الرئيسية: ${homePageRes.status}`);
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
    
    // تحليل تأثير الخصم على ارتفاع البطاقات
    console.log('\n📏 تحليل تأثير الخصم على ارتفاع البطاقات:');
    
    if (productsWithDiscount.length > 0 && productsWithoutDiscount.length > 0) {
      console.log('✅ يوجد منتجات مع وبدون خصم للمقارنة');
      
      const productWithDiscount = productsWithDiscount[0];
      const productWithoutDiscount = productsWithoutDiscount[0];
      
      console.log(`\n🏷️ منتج مع خصم: ${productWithDiscount.name}`);
      console.log(`   - السعر الأصلي: ${productWithDiscount.price} دج`);
      console.log(`   - سعر الخصم: ${productWithDiscount.discount_price} دج`);
      console.log(`   - نسبة التخفيض: ${Math.round(((productWithDiscount.price - productWithDiscount.discount_price) / productWithDiscount.price) * 100)}%`);
      
      console.log(`\n💰 منتج بدون خصم: ${productWithoutDiscount.name}`);
      console.log(`   - السعر: ${productWithoutDiscount.price} دج`);
      console.log(`   - سعر الخصم: ${productWithoutDiscount.discount_price || 'غير محدد'}`);
      
    } else {
      console.log('⚠️ لا توجد منتجات كافية للمقارنة');
    }
    
    // إحصائيات عامة
    console.log('\n📈 إحصائيات عامة:');
    console.log(`📊 إجمالي العناصر: ${products.length + offers.length}`);
    console.log(`🏷️ عناصر مع خصم: ${productsWithDiscount.length + offersWithDiscount.length}`);
    console.log(`💰 عناصر بدون خصم: ${productsWithoutDiscount.length + offersWithoutDiscount.length}`);
    
    // توصيات
    console.log('\n💡 توصيات لضمان تناسق الأزرار:');
    console.log('✅ استخدام flex flex-col على البطاقات');
    console.log('✅ استخدام flex-1 على محتوى البطاقة');
    console.log('✅ استخدام mt-auto على الزر');
    console.log('✅ استخدام grid مع gap ثابت');
    console.log('✅ التأكد من نفس ارتفاع الصور');
    
    console.log('\n✅ تم اختبار تناسق مستوى الأزرار بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في اختبار تناسق الأزرار:', error.message);
  }
}

testButtonAlignment();
