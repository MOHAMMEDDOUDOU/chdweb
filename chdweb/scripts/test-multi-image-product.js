const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testMultiImageProduct() {
  console.log('🚀 اختبار إضافة منتج مع صور متعددة...\n');

  try {
    // اختبار إضافة منتج مع صور متعددة
    console.log('📝 اختبار إضافة منتج مع صور متعددة');
    const productWithMultipleImages = {
      name: "منتج مع صور متعددة",
      price: 2500,
      stock_quantity: 20,
      description: "منتج تجريبي مع دعم الصور المتعددة",
      images: [
        "https://res.cloudinary.com/dtwcnwjel/image/upload/v1755625797/cosmetique-beauty/products/ae7f9p2dsu1l8ewcx7vb.png",
        "https://res.cloudinary.com/dtwcnwjel/image/upload/v1755625811/cosmetique-beauty/products/vmetwrn5i6pwxfqt2fnr.jpg",
        "https://res.cloudinary.com/dtwcnwjel/image/upload/v1755625874/cosmetique-beauty/products/e6kt0rrixr1umw1npi9u.jpg"
      ],
      sizes: ["S", "M", "L"],
      discount_price: 2000,
      is_active: true
    };

    const response = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productWithMultipleImages)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ تم إضافة المنتج مع الصور المتعددة بنجاح!');
      console.log(`📋 معرف المنتج: ${result.id}`);
      console.log(`📊 عدد الصور: ${result.images?.length || 0}`);
      console.log(`📊 المقاسات: ${result.sizes?.join(', ') || 'غير متوفرة'}`);
      console.log(`📊 نسبة الخصم: ${result.discount_price ? Math.round(((result.price - result.discount_price) / result.price) * 100) : 0}%`);
      
      console.log('\n📋 تفاصيل المنتج الكاملة:');
      console.log(JSON.stringify(result, null, 2));
      
      // اختبار جلب المنتج للتأكد من حفظ البيانات
      console.log('\n🔄 اختبار جلب المنتج للتأكد من حفظ البيانات...');
      const getResponse = await fetch(`http://localhost:3001/api/products/${result.id}`);
      
      if (getResponse.ok) {
        const retrievedProduct = await getResponse.json();
        console.log('✅ تم جلب المنتج بنجاح!');
        console.log(`📊 عدد الصور المحفوظة: ${retrievedProduct.images?.length || 0}`);
        console.log(`📊 المقاسات المحفوظة: ${retrievedProduct.sizes?.join(', ') || 'غير متوفرة'}`);
        
        // مقارنة البيانات
        const imagesMatch = JSON.stringify(result.images) === JSON.stringify(retrievedProduct.images);
        const sizesMatch = JSON.stringify(result.sizes) === JSON.stringify(retrievedProduct.sizes);
        
        console.log(`📊 تطابق الصور: ${imagesMatch ? '✅' : '❌'}`);
        console.log(`📊 تطابق المقاسات: ${sizesMatch ? '✅' : '❌'}`);
      } else {
        console.log('❌ فشل في جلب المنتج');
      }
      
    } else {
      const error = await response.text();
      console.log('❌ فشل في إضافة المنتج مع الصور المتعددة');
      console.log(`🔍 تفاصيل الخطأ: ${error}`);
      
      // محاولة تحليل الخطأ
      try {
        const errorObj = JSON.parse(error);
        console.log('🔍 تحليل الخطأ:');
        console.log(JSON.stringify(errorObj, null, 2));
      } catch (e) {
        console.log('🔍 الخطأ ليس بتنسيق JSON');
      }
    }

    // اختبار جلب جميع المنتجات للإحصائيات
    console.log('\n🔄 جلب جميع المنتجات للإحصائيات...');
    const productsResponse = await fetch('http://localhost:3001/api/products');
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      console.log(`📈 إجمالي عدد المنتجات: ${products.length}`);
      
      const productsWithImages = products.filter(p => p.images && p.images.length > 0);
      const productsWithMultipleImages = products.filter(p => p.images && p.images.length > 1);
      const productsWithSizes = products.filter(p => p.sizes && p.sizes.length > 0);
      const productsWithDiscount = products.filter(p => p.discount_price);
      
      console.log(`📊 منتجات مع صور: ${productsWithImages.length}`);
      console.log(`📊 منتجات مع صور متعددة: ${productsWithMultipleImages.length}`);
      console.log(`📊 منتجات مع مقاسات: ${productsWithSizes.length}`);
      console.log(`📊 منتجات مع خصم: ${productsWithDiscount.length}`);
      
      // عرض تفاصيل المنتجات مع صور متعددة
      if (productsWithMultipleImages.length > 0) {
        console.log('\n📋 المنتجات مع صور متعددة:');
        productsWithMultipleImages.forEach((product, index) => {
          console.log(`${index + 1}. ${product.name} - ${product.images.length} صورة`);
        });
      }
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
    console.error('🔍 تفاصيل الخطأ:', error);
  }
}

testMultiImageProduct();
