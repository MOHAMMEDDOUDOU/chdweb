require('dotenv').config();

async function testResaleSystem() {
  console.log('🧪 اختبار نظام إعادة البيع...');
  
  const baseURL = 'http://localhost:3000';
  
  try {
    // اختبار إنشاء طلب مع معلومات إعادة البيع
    console.log('📝 اختبار إنشاء طلب مع معلومات إعادة البيع...');
    
    const orderPayload = {
      item_type: 'product',
      item_id: 'test-product-id',
      item_name: 'منتج تجريبي',
      quantity: 1,
      unit_price: 1500,
      subtotal: 1500,
      shipping_cost: 500,
      total_amount: 2000,
      customer_name: 'أحمد محمد',
      phone_number: '0550123456',
      wilaya: 'الجزائر',
      commune: 'الجزائر الوسطى',
      delivery_type: 'home',
      reseller_price: 1500,
      reseller_name: 'محمد علي',
      reseller_phone: '0550123457'
    };

    const orderResponse = await fetch(`${baseURL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    
    const orderData = await orderResponse.json();
    console.log('✅ استجابة إنشاء الطلب:', {
      status: orderResponse.status,
      data: orderData
    });

    // اختبار إنشاء طلب مع مستخدم مسجل دخول
    console.log('🔐 اختبار إنشاء طلب مع مستخدم مسجل دخول...');
    
    // أولاً تسجيل دخول
    const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'apitest2',
        password: '123456'
      })
    });
    
    if (loginResponse.ok) {
      const cookies = loginResponse.headers.get('set-cookie');
      
      // إنشاء طلب مع مستخدم مسجل دخول
      const orderWithUserPayload = {
        item_type: 'offer',
        item_id: 'test-offer-id',
        item_name: 'عرض تجريبي',
        quantity: 2,
        unit_price: 2000,
        subtotal: 4000,
        shipping_cost: 600,
        total_amount: 4600,
        customer_name: 'فاطمة أحمد',
        phone_number: '0550123458',
        wilaya: 'وهران',
        commune: 'وهران',
        delivery_type: 'home',
        reseller_price: 2000
      };

      const orderWithUserResponse = await fetch(`${baseURL}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': cookies || ''
        },
        body: JSON.stringify(orderWithUserPayload)
      });
      
      const orderWithUserData = await orderWithUserResponse.json();
      console.log('✅ استجابة إنشاء الطلب مع مستخدم مسجل دخول:', {
        status: orderWithUserResponse.status,
        data: orderWithUserData
      });
    }

    console.log('🎉 اختبار نظام إعادة البيع مكتمل!');

  } catch (error) {
    console.error('❌ خطأ في اختبار نظام إعادة البيع:', error.message);
  }
}

testResaleSystem();
