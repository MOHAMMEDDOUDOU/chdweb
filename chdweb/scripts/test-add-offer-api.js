const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAddOfferAPI() {
  try {
    console.log('🚀 بدء اختبار إضافة عرض جديد عبر API...');
    
    // بيانات العرض الجديد
    const newOffer = {
      name: 'عرض خاص - مجموعة ماكياج كاملة',
      description: 'مجموعة ماكياج احترافية تتضمن أحمر شفاه، كحل، وماسكارا بجودة عالية',
      price: 2500.00,
      discount_price: 1800.00,
      image_url: 'https://example.com/makeup-set.jpg',
      stock_quantity: 50,
      sizes: ['صغير', 'متوسط', 'كبير'],
      images: [
        'https://example.com/makeup-set-1.jpg',
        'https://example.com/makeup-set-2.jpg',
        'https://example.com/makeup-set-3.jpg'
      ],
      category: 'Maquillage'
    };

    console.log('📝 بيانات العرض المراد إضافته:', JSON.stringify(newOffer, null, 2));

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
    } else {
      const error = await response.json();
      console.log('❌ خطأ في إضافة العرض:', error);
    }

    // اختبار جلب جميع العروض
    console.log('\n🔄 جلب جميع العروض...');
    const getResponse = await fetch('http://localhost:3001/api/offers');
    
    if (getResponse.ok) {
      const offers = await getResponse.json();
      console.log('📋 جميع العروض:', JSON.stringify(offers, null, 2));
      console.log('📈 إجمالي عدد العروض:', offers.length);
    } else {
      console.log('❌ خطأ في جلب العروض:', getResponse.statusText);
    }

    // اختبار إضافة عرض ثاني
    const secondOffer = {
      name: 'عرض العطور الفاخرة',
      description: 'مجموعة عطور فاخرة من أفضل الماركات العالمية',
      price: 3500.00,
      discount_price: 2800.00,
      image_url: 'https://example.com/perfume-set.jpg',
      stock_quantity: 25,
      sizes: ['30ml', '50ml', '100ml'],
      images: [
        'https://example.com/perfume-1.jpg',
        'https://example.com/perfume-2.jpg'
      ],
      category: 'Parfums'
    };

    console.log('\n🔄 إضافة عرض ثاني...');
    const secondResponse = await fetch('http://localhost:3001/api/offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(secondOffer)
    });

    if (secondResponse.ok) {
      const secondCreatedOffer = await secondResponse.json();
      console.log('✅ تم إضافة العرض الثاني بنجاح!');
      console.log('📊 تفاصيل العرض الثاني:', JSON.stringify(secondCreatedOffer, null, 2));
    } else {
      const error = await secondResponse.json();
      console.log('❌ خطأ في إضافة العرض الثاني:', error);
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
    console.error('🔍 تفاصيل الخطأ:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 المشكلة: الخادم غير مشغل. تأكد من تشغيل "npm run dev" أو "pnpm dev"');
    } else if (error.code === 'ENOTFOUND') {
      console.log('💡 المشكلة: لا يمكن العثور على الخادم المحلي');
    }
  }
}

// تشغيل الاختبار
testAddOfferAPI();
