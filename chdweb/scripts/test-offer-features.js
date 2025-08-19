const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testOfferFeatures() {
  try {
    console.log('🚀 بدء اختبار ميزات العروض الجديدة...');
    
    // اختبار 1: إضافة عرض بدون أي حقول اختيارية
    console.log('\n📝 اختبار 1: إضافة عرض بدون حقول اختيارية');
    const basicOffer = {
      name: 'عرض أساسي - منتج بسيط',
      price: 1500.00,
      stock_quantity: 20
      // لا يوجد discount_price, description, sizes, images
    };

    const response1 = await fetch('http://localhost:3001/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(basicOffer)
    });

    if (response1.ok) {
      const createdOffer1 = await response1.json();
      console.log('✅ تم إضافة العرض الأساسي بنجاح!');
      console.log('📊 تفاصيل العرض:', {
        id: createdOffer1.id,
        name: createdOffer1.name,
        price: createdOffer1.price,
        discount_price: createdOffer1.discount_price,
        description: createdOffer1.description,
        sizes: createdOffer1.sizes,
        images: createdOffer1.images,
        category: createdOffer1.category
      });
    } else {
      const error = await response1.json();
      console.log('❌ خطأ في إضافة العرض الأساسي:', error);
    }

    // اختبار 2: إضافة عرض مع سعر الخصم فقط
    console.log('\n📝 اختبار 2: إضافة عرض مع سعر الخصم');
    const discountOffer = {
      name: 'عرض مع خصم - منتج مخفض',
      price: 2000.00,
      discount_price: 1500.00,
      stock_quantity: 15
    };

    const response2 = await fetch('http://localhost:3001/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discountOffer)
    });

    if (response2.ok) {
      const createdOffer2 = await response2.json();
      console.log('✅ تم إضافة العرض مع الخصم بنجاح!');
      console.log('📊 نسبة الخصم:', `${Math.round(((createdOffer2.price - createdOffer2.discount_price) / createdOffer2.price) * 100)}%`);
    } else {
      const error = await response2.json();
      console.log('❌ خطأ في إضافة العرض مع الخصم:', error);
    }

    // اختبار 3: إضافة عرض مع وصف فقط
    console.log('\n📝 اختبار 3: إضافة عرض مع وصف');
    const descriptionOffer = {
      name: 'عرض مع وصف - منتج موصوف',
      price: 1800.00,
      stock_quantity: 25,
      description: 'هذا منتج عالي الجودة مع وصف تفصيلي يوضح جميع المميزات والخصائص'
    };

    const response3 = await fetch('http://localhost:3001/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(descriptionOffer)
    });

    if (response3.ok) {
      const createdOffer3 = await response3.json();
      console.log('✅ تم إضافة العرض مع الوصف بنجاح!');
      console.log('📊 طول الوصف:', createdOffer3.description?.length, 'حرف');
    } else {
      const error = await response3.json();
      console.log('❌ خطأ في إضافة العرض مع الوصف:', error);
    }

    // اختبار 4: إضافة عرض مع مقاسات فقط
    console.log('\n📝 اختبار 4: إضافة عرض مع مقاسات');
    const sizesOffer = {
      name: 'عرض مع مقاسات - ملابس',
      price: 1200.00,
      stock_quantity: 30,
      sizes: ['S', 'M', 'L', 'XL']
    };

    const response4 = await fetch('http://localhost:3001/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sizesOffer)
    });

    if (response4.ok) {
      const createdOffer4 = await response4.json();
      console.log('✅ تم إضافة العرض مع المقاسات بنجاح!');
      console.log('📊 المقاسات المتوفرة:', createdOffer4.sizes?.join(', '));
    } else {
      const error = await response4.json();
      console.log('❌ خطأ في إضافة العرض مع المقاسات:', error);
    }

    // اختبار 5: إضافة عرض مع صور فقط
    console.log('\n📝 اختبار 5: إضافة عرض مع صور');
    const imagesOffer = {
      name: 'عرض مع صور - منتج مصور',
      price: 2500.00,
      stock_quantity: 10,
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg'
      ]
    };

    const response5 = await fetch('http://localhost:3001/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(imagesOffer)
    });

    if (response5.ok) {
      const createdOffer5 = await response5.json();
      console.log('✅ تم إضافة العرض مع الصور بنجاح!');
      console.log('📊 عدد الصور:', createdOffer5.images?.length);
    } else {
      const error = await response5.json();
      console.log('❌ خطأ في إضافة العرض مع الصور:', error);
    }

    // عرض إحصائيات نهائية
    console.log('\n🔄 جلب جميع العروض للإحصائيات النهائية...');
    const getResponse = await fetch('http://localhost:3001/api/offers');
    
    if (getResponse.ok) {
      const offers = await getResponse.json();
      console.log('📈 إجمالي عدد العروض:', offers.length);
      
      // إحصائيات مفصلة
      const offersWithDiscount = offers.filter(offer => offer.discount_price !== null).length;
      const offersWithDescription = offers.filter(offer => offer.description !== null).length;
      const offersWithSizes = offers.filter(offer => offer.sizes !== null && offer.sizes.length > 0).length;
      const offersWithImages = offers.filter(offer => offer.images !== null && offer.images.length > 0).length;
      const offersWithCategory = offers.filter(offer => offer.category !== null).length;
      
      console.log('\n📊 إحصائيات مفصلة للعروض:');
      console.log(`- عروض مع خصم: ${offersWithDiscount}`);
      console.log(`- عروض مع وصف: ${offersWithDescription}`);
      console.log(`- عروض مع مقاسات: ${offersWithSizes}`);
      console.log(`- عروض مع صور: ${offersWithImages}`);
      console.log(`- عروض مع فئة: ${offersWithCategory}`);
      console.log(`- عروض بدون فئة: ${offers.length - offersWithCategory}`);
      
      // عرض آخر 3 عروض
      console.log('\n🆕 آخر 3 عروض مضافة:');
      offers.slice(0, 3).forEach((offer, index) => {
        console.log(`${index + 1}. ${offer.name} - ${offer.price} دج`);
      });
    } else {
      console.log('❌ خطأ في جلب العروض:', getResponse.statusText);
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
    console.error('🔍 تفاصيل الخطأ:', error.message);
  }
}

// تشغيل الاختبار
testOfferFeatures();
