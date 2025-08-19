const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testImageGallery() {
  console.log('🖼️ اختبار معرض الصور...\n');

  try {
    // جلب منتج مع صور متعددة
    console.log('📝 جلب منتج مع صور متعددة...');
    const productsRes = await fetch('http://localhost:3001/api/products');
    const products = await productsRes.json();
    
    const productWithImages = products.find(p => p.images && p.images.length > 1);
    
    if (!productWithImages) {
      console.log('❌ لا يوجد منتج مع صور متعددة للاختبار');
      return;
    }
    
    console.log(`✅ تم العثور على منتج: ${productWithImages.name}`);
    console.log(`📊 عدد الصور: ${productWithImages.images.length}`);
    console.log(`🖼️ الصور: ${productWithImages.images.join(', ')}`);
    
    // اختبار صفحة طلب المنتج
    console.log(`\n🔗 اختبار صفحة طلب المنتج: ${productWithImages.id}`);
    const orderPageRes = await fetch(`http://localhost:3001/order/${productWithImages.id}`);
    
    if (orderPageRes.ok) {
      console.log('✅ صفحة طلب المنتج تعمل بشكل صحيح');
      
      // اختبار مع معلمات URL
      const testUrl = `http://localhost:3001/order/${productWithImages.id}?type=product&price=${productWithImages.price}`;
      console.log(`🔗 اختبار URL: ${testUrl}`);
      
      const testRes = await fetch(testUrl);
      if (testRes.ok) {
        console.log('✅ صفحة الطلب مع المعلمات تعمل بشكل صحيح');
      } else {
        console.log(`❌ خطأ في صفحة الطلب: ${testRes.status}`);
      }
    } else {
      console.log(`❌ خطأ في صفحة طلب المنتج: ${orderPageRes.status}`);
    }
    
    // اختبار جلب منتج واحد
    console.log(`\n📝 اختبار جلب منتج واحد: ${productWithImages.id}`);
    const singleProductRes = await fetch(`http://localhost:3001/api/products/${productWithImages.id}`);
    
    if (singleProductRes.ok) {
      const singleProduct = await singleProductRes.json();
      console.log('✅ تم جلب المنتج بنجاح');
      console.log(`📋 اسم المنتج: ${singleProduct.name}`);
      console.log(`🖼️ عدد الصور: ${singleProduct.images ? singleProduct.images.length : 0}`);
      console.log(`💰 السعر: ${singleProduct.price}`);
      
      if (singleProduct.images && singleProduct.images.length > 0) {
        console.log('✅ المنتج يحتوي على صور متعددة');
        console.log(`🖼️ الصورة الأولى: ${singleProduct.images[0]}`);
        console.log(`🖼️ جميع الصور: ${singleProduct.images.join(', ')}`);
      }
    } else {
      console.log(`❌ خطأ في جلب المنتج: ${singleProductRes.status}`);
    }
    
    console.log('\n✅ تم اختبار معرض الصور بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في اختبار معرض الصور:', error.message);
  }
}

testImageGallery();
