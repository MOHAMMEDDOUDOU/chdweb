const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testProductImagesDisplay() {
  console.log('🖼️ اختبار عرض الصور في الصفحة الرئيسية...\n');

  try {
    // جلب المنتجات
    console.log('📝 جلب المنتجات من API...');
    const productsRes = await fetch('http://localhost:3001/api/products');
    const products = await productsRes.json();
    
    console.log(`📊 إجمالي المنتجات: ${products.length}`);
    
    // تحليل الصور
    const productsWithImages = products.filter(p => p.images && p.images.length > 0);
    const productsWithSingleImage = products.filter(p => p.image_url && !p.images);
    const productsWithoutImages = products.filter(p => !p.images && !p.image_url);
    
    console.log(`🖼️ منتجات مع صور متعددة: ${productsWithImages.length}`);
    console.log(`🖼️ منتجات مع صورة واحدة: ${productsWithSingleImage.length}`);
    console.log(`❌ منتجات بدون صور: ${productsWithoutImages.length}`);
    
    // عرض تفاصيل المنتجات مع الصور
    if (productsWithImages.length > 0) {
      console.log('\n📋 المنتجات مع صور متعددة:');
      productsWithImages.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   - عدد الصور: ${product.images.length}`);
        console.log(`   - الصورة الأولى: ${product.images[0]}`);
        console.log(`   - جميع الصور: ${product.images.join(', ')}`);
        console.log('');
      });
    }
    
    if (productsWithSingleImage.length > 0) {
      console.log('\n📋 المنتجات مع صورة واحدة:');
      productsWithSingleImage.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   - الصورة: ${product.image_url}`);
        console.log('');
      });
    }
    
    if (productsWithoutImages.length > 0) {
      console.log('\n📋 المنتجات بدون صور:');
      productsWithoutImages.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log('');
      });
    }
    
    // اختبار عرض الصفحة الرئيسية
    console.log('\n🌐 اختبار عرض الصفحة الرئيسية...');
    const homePageRes = await fetch('http://localhost:3001/');
    const homePageHtml = await homePageRes.text();
    
    // التحقق من وجود عناصر الصور
    const hasImageElements = homePageHtml.includes('img src=');
    const hasProductCards = homePageHtml.includes('صورة المنتج');
    const hasOfferImages = homePageHtml.includes('object-cover');
    
    console.log(`✅ الصفحة تحتوي على عناصر صور: ${hasImageElements}`);
    console.log(`✅ الصفحة تحتوي على بطاقات منتجات: ${hasProductCards}`);
    console.log(`✅ الصفحة تحتوي على صور عروض: ${hasOfferImages}`);
    
    // اختبار صفحة طلب منتج مع صور متعددة
    if (productsWithImages.length > 0) {
      const testProduct = productsWithImages[0];
      console.log(`\n🔗 اختبار صفحة طلب المنتج: ${testProduct.name}`);
      
      const orderPageRes = await fetch(`http://localhost:3001/order/${testProduct.id}`);
      const orderPageHtml = await orderPageRes.text();
      
      const hasImageGallery = orderPageHtml.includes('ImageGallery');
      const hasNavigationButtons = orderPageHtml.includes('ChevronLeft') || orderPageHtml.includes('ChevronRight');
      const hasThumbnails = orderPageHtml.includes('w-16 h-16');
      
      console.log(`✅ صفحة الطلب تحتوي على معرض صور: ${hasImageGallery}`);
      console.log(`✅ صفحة الطلب تحتوي على أزرار تنقل: ${hasNavigationButtons}`);
      console.log(`✅ صفحة الطلب تحتوي على صور مصغرة: ${hasThumbnails}`);
    }
    
    console.log('\n✅ تم اختبار عرض الصور بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في اختبار عرض الصور:', error.message);
  }
}

testProductImagesDisplay();
