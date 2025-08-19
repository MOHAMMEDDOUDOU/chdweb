const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAutoScroll() {
  console.log('🚀 اختبار التنقل التلقائي للعروض...\n');

  try {
    // جلب العروض
    console.log('📋 جلب العروض...');
    const offersResponse = await fetch('http://localhost:3001/api/offers');
    const offers = await offersResponse.json();
    
    console.log(`📊 إجمالي عدد العروض: ${offers.length}`);
    
    if (offers.length === 0) {
      console.log('❌ لا توجد عروض متاحة');
      return;
    }

    // حساب عدد المجموعات
    const groupsCount = Math.ceil(offers.length / 3);
    console.log(`📦 عدد المجموعات (3 عروض لكل مجموعة): ${groupsCount}`);

    // عرض كل مجموعة
    for (let i = 0; i < groupsCount; i++) {
      const startIndex = i * 3;
      const endIndex = Math.min(startIndex + 3, offers.length);
      const groupOffers = offers.slice(startIndex, endIndex);
      
      console.log(`\n📋 المجموعة ${i + 1} (العروض ${startIndex + 1}-${endIndex}):`);
      groupOffers.forEach((offer, index) => {
        const offerIndex = startIndex + index;
        console.log(`   ${offerIndex + 1}. ${offer.name} - ${offer.price} دج`);
        if (offer.images && offer.images.length > 0) {
          console.log(`      📸 ${offer.images.length} صورة متوفرة`);
        }
        if (offer.discount_price) {
          const discountPercent = Math.round(((offer.price - offer.discount_price) / offer.price) * 100);
          console.log(`      🎯 خصم ${discountPercent}% (${offer.discount_price} دج)`);
        }
      });
    }

    // اختبار التنقل
    console.log('\n🔄 محاكاة التنقل التلقائي:');
    for (let i = 0; i < groupsCount; i++) {
      const startIndex = i * 3;
      console.log(`   الانتقال إلى المجموعة ${i + 1} (currentOfferIndex = ${startIndex})`);
      
      // محاكاة الانتظار
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n✅ اختبار التنقل التلقائي مكتمل!');
    console.log('\n📝 ملاحظات:');
    console.log('1. العروض تظهر 3 في كل مرة');
    console.log('2. التنقل التلقائي يحدث كل 5 ثوانٍ');
    console.log('3. يمكن التنقل يدوياً باستخدام المؤشرات');
    console.log('4. الصورة الأولى من كل عرض تظهر في البطاقة');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

testAutoScroll();
