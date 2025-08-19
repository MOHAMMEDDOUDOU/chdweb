require('dotenv').config();

async function testAPI() {
  console.log('🧪 اختبار API Routes...');
  
  const baseURL = 'http://localhost:3000';
  
  try {
    // اختبار التسجيل
    console.log('📝 اختبار التسجيل...');
    const registerResponse = await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'apitest2',
        phone_number: '0550123458',
        password: '123456',
        full_name: 'اختبار API 2'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('✅ استجابة التسجيل:', {
      status: registerResponse.status,
      data: registerData
    });
    
    if (registerResponse.ok) {
      // اختبار تسجيل الدخول
      console.log('🔐 اختبار تسجيل الدخول...');
      const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'apitest2',
          password: '123456'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('✅ استجابة تسجيل الدخول:', {
        status: loginResponse.status,
        data: loginData,
        cookies: loginResponse.headers.get('set-cookie')
      });
      
      if (loginResponse.ok) {
        // اختبار /api/auth/me
        console.log('👤 اختبار /api/auth/me...');
        const meResponse = await fetch(`${baseURL}/api/auth/me`, {
          headers: {
            'Cookie': loginResponse.headers.get('set-cookie') || ''
          }
        });
        
        const meData = await meResponse.json();
        console.log('✅ استجابة /api/auth/me:', {
          status: meResponse.status,
          data: meData
        });
      }
    }
    
  } catch (error) {
    console.error('❌ خطأ في اختبار API:', error.message);
  }
}

testAPI();
