const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// إعدادات Cloudinary
cloudinary.config({
  cloud_name: 'dldvpyait',
  api_key: '492293214411789',
  api_secret: 'zx7-Eyg7oPWpIKObKC62rhmMDPA',
});

const brandsDir = path.join(__dirname, '../public/images/brands');

async function uploadAllBrands() {
  const files = fs.readdirSync(brandsDir);
  const results = [];
  for (const file of files) {
    const filePath = path.join(brandsDir, file);
    const publicId = 'brands/' + path.parse(file).name;
    try {
      const res = await cloudinary.uploader.upload(filePath, {
        folder: 'brands',
        public_id: path.parse(file).name,
        overwrite: true,
        resource_type: 'image',
      });
      results.push({ name: file, url: res.secure_url });
      console.log(`${file} => ${res.secure_url}`);
    } catch (err) {
      console.error(`خطأ في رفع ${file}:`, err.message);
    }
  }
  // طباعة جدول الروابط
  console.log('\nجميع الروابط:');
  results.forEach(r => console.log(`${r.name}: ${r.url}`));
}

uploadAllBrands();
