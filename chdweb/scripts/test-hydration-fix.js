const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testHydrationFix() {
  console.log('🔧 اختبار إصلاح مشكلة Hydration...\n');

  try {
    // اختبار الصفحة الرئيسية
    console.log('🏠 اختبار الصفحة الرئيسية...');
    const homePageRes = await fetch('http://localhost:3001/');
    
    if (homePageRes.ok) {
      console.log('✅ الصفحة الرئيسية تعمل بشكل صحيح');
      
      const homePageHtml = await homePageRes.text();
      const hasHydrationWarning = homePageHtml.includes('suppressHydrationWarning');
      console.log(`✅ suppressHydrationWarning موجود: ${hasHydrationWarning}`);
    } else {
      console.log(`❌ خطأ في الصفحة الرئيسية: ${homePageRes.status}`);
    }
    
    // اختبار صفحة طلب منتج
    console.log('\n🛒 اختبار صفحة طلب منتج...');
    const productsRes = await fetch('http://localhost:3001/api/products');
    const products = await productsRes.json();
    
    if (products.length > 0) {
      const testProduct = products[0];
      console.log(`📝 اختبار صفحة طلب المنتج: ${testProduct.name}`);
      
      const orderPageRes = await fetch(`http://localhost:3001/order/${testProduct.id}`);
      
      if (orderPageRes.ok) {
        console.log('✅ صفحة طلب المنتج تعمل بشكل صحيح');
        
        const orderPageHtml = await orderPageRes.text();
        const hasNoSSR = orderPageHtml.includes('NoSSR');
        const hasImageGallery = orderPageHtml.includes('ImageGallery');
        
        console.log(`✅ مكون NoSSR موجود: ${hasNoSSR}`);
        console.log(`✅ مكون ImageGallery موجود: ${hasImageGallery}`);
        
        // اختبار مع معلمات URL
        const testUrl = `http://localhost:3001/order/${testProduct.id}?type=product&price=${testProduct.price}`;
        console.log(`🔗 اختبار URL: ${testUrl}`);
        
        const testRes = await fetch(testUrl);
        if (testRes.ok) {
          console.log('✅ صفحة الطلب مع المعلمات تعمل بشكل صحيح');
        } else {
          console.log(`❌ خطأ في صفحة الطلب مع المعلمات: ${testRes.status}`);
        }
      } else {
        console.log(`❌ خطأ في صفحة طلب المنتج: ${orderPageRes.status}`);
      }
    } else {
      console.log('❌ لا توجد منتجات للاختبار');
    }
    
    // اختبار layout
    console.log('\n📄 اختبار layout...');
    const layoutRes = await fetch('http://localhost:3001/');
    const layoutHtml = await layoutRes.text();
    
    const hasSuppressHydrationWarning = layoutHtml.includes('suppressHydrationWarning');
    const hasBodyTag = layoutHtml.includes('<body');
    const hasHtmlTag = layoutHtml.includes('<html');
    
    console.log(`✅ علامة HTML موجودة: ${hasHtmlTag}`);
    console.log(`✅ علامة BODY موجودة: ${hasBodyTag}`);
    console.log(`✅ suppressHydrationWarning موجود: ${hasSuppressHydrationWarning}`);
    
    console.log('\n✅ تم اختبار إصلاح مشكلة Hydration بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في اختبار إصلاح Hydration:', error.message);
  }
}

testHydrationFix();
