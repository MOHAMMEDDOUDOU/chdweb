const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAddOfferNoCategory() {
  try {
    console.log('🚀 بدء اختبار إضافة عرض بدون فئة...');
    
    // بيانات العرض الجديد بدون فئة
    const newOffer = {
      name: 'عرض خاص - مجموعة العناية بالبشرة',
      description: 'مجموعة شاملة للعناية بالبشرة تتضمن منظف، مرطب، ومقشر طبيعي',
      price: 3200.00,
      discount_price: 2400.00,
      image_url: 'https://example.com/skincare-set.jpg',
      stock_quantity: 30,
      sizes: ['صغير', 'متوسط', 'كبير'],
      images: [
        'https://example.com/skincare-1.jpg',
        'https://example.com/skincare-2.jpg',
        'https://example.com/skincare-3.jpg'
      ]
      // لا يوجد حقل category
    };

    console.log('📝 بيانات العرض المراد إضافته (بدون فئة):', JSON.stringify(newOffer, null, 2));

    // إضافة العرض عبر API
    const response = await fetch('http://localhost:3001/api/offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOffer)
    });

    console.log('📊 استجابة API:', response.status, response.statusText);

    if (response.ok) {
      const createdOffer = await response.json();
      console.log('✅ تم إضافة العرض بنجاح!');
      console.log('📊 تفاصيل العرض المضاف:', JSON.stringify(createdOffer, null, 2));
      
      // التحقق من أن الفئة null
      if (createdOffer.category === null) {
        console.log('✅ تم التأكد من أن الفئة فارغة (null)');
      } else {
        console.log('⚠️ الفئة ليست فارغة:', createdOffer.category);
      }
    } else {
      const error = await response.json();
      console.log('❌ خطأ في إضافة العرض:', error);
    }

    // اختبار إضافة عرض بدون وصف
    const offerWithoutDescription = {
      name: 'عرض الأجهزة الكهربائية',
      price: 4500.00,
      discount_price: 3800.00,
      image_url: 'https://example.com/electronics.jpg',
      stock_quantity: 15,
      sizes: ['واحد', 'متعدد'],
      images: [
        'https://example.com/electronics-1.jpg'
      ]
      // لا يوجد description ولا category
    };

    console.log('\n🔄 إضافة عرض بدون وصف...');
    const secondResponse = await fetch('http://localhost:3001/api/offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(offerWithoutDescription)
    });

    if (secondResponse.ok) {
      const secondCreatedOffer = await secondResponse.json();
      console.log('✅ تم إضافة العرض الثاني بنجاح!');
      console.log('📊 تفاصيل العرض الثاني:', JSON.stringify(secondCreatedOffer, null, 2));
      
      // التحقق من أن الوصف null
      if (secondCreatedOffer.description === null) {
        console.log('✅ تم التأكد من أن الوصف فارغ (null)');
      } else {
        console.log('⚠️ الوصف ليس فارغاً:', secondCreatedOffer.description);
      }
    } else {
      const error = await secondResponse.json();
      console.log('❌ خطأ في إضافة العرض الثاني:', error);
    }

    // عرض جميع العروض
    console.log('\n🔄 جلب جميع العروض...');
    const getResponse = await fetch('http://localhost:3001/api/offers');
    
    if (getResponse.ok) {
      const offers = await getResponse.json();
      console.log('📋 جميع العروض:', JSON.stringify(offers, null, 2));
      console.log('📈 إجمالي عدد العروض:', offers.length);
      
      // إحصائيات العروض
      const offersWithCategory = offers.filter(offer => offer.category !== null).length;
      const offersWithoutCategory = offers.filter(offer => offer.category === null).length;
      const offersWithDescription = offers.filter(offer => offer.description !== null).length;
      const offersWithoutDescription = offers.filter(offer => offer.description === null).length;
      
      console.log('\n📊 إحصائيات العروض:');
      console.log(`- عروض مع فئة: ${offersWithCategory}`);
      console.log(`- عروض بدون فئة: ${offersWithoutCategory}`);
      console.log(`- عروض مع وصف: ${offersWithDescription}`);
      console.log(`- عروض بدون وصف: ${offersWithoutDescription}`);
    } else {
      console.log('❌ خطأ في جلب العروض:', getResponse.statusText);
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
    console.error('🔍 تفاصيل الخطأ:', error.message);
  }
}

// تشغيل الاختبار
testAddOfferNoCategory();
