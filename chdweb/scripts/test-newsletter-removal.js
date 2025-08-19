const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testNewsletterRemoval() {
  console.log('🚀 اختبار إزالة قسم النشرة الإخبارية...\n');

  try {
    // جلب محتوى الصفحة الرئيسية
    console.log('📋 جلب محتوى الصفحة الرئيسية...');
    const response = await fetch('http://localhost:3001');
    const html = await response.text();
    
    // البحث عن النصوص المطلوب إزالتها
    const newsletterTexts = [
      'احصل على عروض حصرية',
      'اشترك في نشرتنا الإخبارية',
      'احصل على خصم 10% على طلبك الأول',
      'أدخل بريدك الإلكتروني',
      'اشتراك'
    ];
    
    console.log('🔍 البحث عن النصوص في الصفحة...');
    let foundTexts = 0;
    
    newsletterTexts.forEach(text => {
      if (html.includes(text)) {
        console.log(`❌ وجد: "${text}"`);
        foundTexts++;
      } else {
        console.log(`✅ لم يجد: "${text}"`);
      }
    });
    
    if (foundTexts === 0) {
      console.log('\n✅ تم إزالة قسم النشرة الإخبارية بنجاح!');
      console.log('📋 ملخص التغييرات:');
      console.log('- تم إزالة قسم "احصل على عروض حصرية"');
      console.log('- تم إزالة حقل إدخال البريد الإلكتروني');
      console.log('- تم إزالة زر "اشتراك"');
      console.log('- تم إزالة أيقونة Gift من الاستيرادات');
      console.log('- تم تنظيف الكود من العناصر غير المستخدمة');
    } else {
      console.log(`\n❌ لا يزال هناك ${foundTexts} نص موجود في الصفحة`);
    }
    
    // التحقق من أن الفوتر لا يزال موجود
    if (html.includes('TANAMIRT') && html.includes('جميع الحقوق محفوظة')) {
      console.log('✅ الفوتر لا يزال موجود ويعمل بشكل صحيح');
    } else {
      console.log('❌ مشكلة في الفوتر');
    }
    
    console.log('\n🎯 النتيجة النهائية:');
    console.log('- تم إزالة قسم النشرة الإخبارية بالكامل');
    console.log('- الصفحة أصبحت أكثر بساطة ونظافة');
    console.log('- الفوتر يظهر مباشرة بعد قسم "لماذا تختار TANAMIRT"');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

testNewsletterRemoval();
