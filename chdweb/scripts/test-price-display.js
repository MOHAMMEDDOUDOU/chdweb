const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testPriceDisplay() {
  console.log('💰 اختبار عرض الأسعار والخصومات...\n');

  try {
    // جلب المنتجات
    console.log('📝 جلب المنتجات...');
    const productsRes = await fetch('http://localhost:3001/api/products');
    const products = await productsRes.json();
    
    console.log(`📊 إجمالي المنتجات: ${products.length}`);
    
    // تحليل الأسعار
    const productsWithDiscount = products.filter(p => p.discount_price && p.discount_price > 0);
    const productsWithoutDiscount = products.filter(p => !p.discount_price || p.discount_price <= 0);
    
    console.log(`🏷️ منتجات مع خصم: ${productsWithDiscount.length}`);
    console.log(`💰 منتجات بدون خصم: ${productsWithoutDiscount.length}`);
    
    // عرض تفاصيل المنتجات مع خصم
    if (productsWithDiscount.length > 0) {
      console.log('\n🏷️ المنتجات مع خصم:');
      productsWithDiscount.forEach((product, index) => {
        const discountPercentage = Math.round(((product.price - product.discount_price) / product.price) * 100);
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   - السعر الأصلي: ${product.price} دج`);
        console.log(`   - سعر الخصم: ${product.discount_price} دج`);
        console.log(`   - نسبة التخفيض: ${discountPercentage}%`);
        console.log(`   - التوفير: ${product.price - product.discount_price} دج`);
        console.log('');
      });
    }
    
    // عرض تفاصيل المنتجات بدون خصم
    if (productsWithoutDiscount.length > 0) {
      console.log('\n💰 المنتجات بدون خصم:');
      productsWithoutDiscount.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   - السعر: ${product.price} دج`);
        console.log(`   - سعر الخصم: ${product.discount_price || 'غير محدد'}`);
        console.log('');
      });
    }
    
    // جلب العروض
    console.log('📝 جلب العروض...');
    const offersRes = await fetch('http://localhost:3001/api/offers');
    const offers = await offersRes.json();
    
    console.log(`📊 إجمالي العروض: ${offers.length}`);
    
    // تحليل أسعار العروض
    const offersWithDiscount = offers.filter(o => o.discount_price && o.discount_price > 0);
    const offersWithoutDiscount = offers.filter(o => !o.discount_price || o.discount_price <= 0);
    
    console.log(`🏷️ عروض مع خصم: ${offersWithDiscount.length}`);
    console.log(`💰 عروض بدون خصم: ${offersWithoutDiscount.length}`);
    
    // عرض تفاصيل العروض مع خصم
    if (offersWithDiscount.length > 0) {
      console.log('\n🏷️ العروض مع خصم:');
      offersWithDiscount.forEach((offer, index) => {
        const discountPercentage = Math.round(((offer.price - offer.discount_price) / offer.price) * 100);
        console.log(`${index + 1}. ${offer.name}`);
        console.log(`   - السعر الأصلي: ${offer.price} دج`);
        console.log(`   - سعر الخصم: ${offer.discount_price} دج`);
        console.log(`   - نسبة التخفيض: ${discountPercentage}%`);
        console.log(`   - التوفير: ${offer.price - offer.discount_price} دج`);
        console.log('');
      });
    }
    
    // اختبار صفحة طلب منتج مع خصم
    if (productsWithDiscount.length > 0) {
      const testProduct = productsWithDiscount[0];
      console.log(`🔗 اختبار صفحة طلب منتج مع خصم: ${testProduct.name}`);
      
      const orderPageRes = await fetch(`http://localhost:3001/order/${testProduct.id}`);
      
      if (orderPageRes.ok) {
        console.log('✅ صفحة طلب المنتج تعمل بشكل صحيح');
        
        const orderPageHtml = await orderPageRes.text();
        const hasDiscountPrice = orderPageHtml.includes(testProduct.discount_price.toString());
        const hasOriginalPrice = orderPageHtml.includes(testProduct.price.toString());
        const hasDiscountPercentage = orderPageHtml.includes('خصم');
        
        console.log(`✅ سعر الخصم موجود: ${hasDiscountPrice}`);
        console.log(`✅ السعر الأصلي موجود: ${hasOriginalPrice}`);
        console.log(`✅ نسبة التخفيض موجودة: ${hasDiscountPercentage}`);
      } else {
        console.log(`❌ خطأ في صفحة طلب المنتج: ${orderPageRes.status}`);
      }
    }
    
    // إحصائيات عامة
    console.log('\n📈 إحصائيات عامة:');
    console.log(`📊 إجمالي المنتجات والعروض: ${products.length + offers.length}`);
    console.log(`🏷️ إجمالي العناصر مع خصم: ${productsWithDiscount.length + offersWithDiscount.length}`);
    console.log(`💰 إجمالي العناصر بدون خصم: ${productsWithoutDiscount.length + offersWithoutDiscount.length}`);
    
    // حساب متوسط التوفير
    const allDiscountedItems = [...productsWithDiscount, ...offersWithDiscount];
    if (allDiscountedItems.length > 0) {
      const totalSavings = allDiscountedItems.reduce((sum, item) => {
        return sum + (item.price - item.discount_price);
      }, 0);
      const averageSavings = totalSavings / allDiscountedItems.length;
      console.log(`💵 متوسط التوفير: ${averageSavings.toFixed(2)} دج`);
    }
    
    console.log('\n✅ تم اختبار عرض الأسعار بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في اختبار عرض الأسعار:', error.message);
  }
}

testPriceDisplay();
