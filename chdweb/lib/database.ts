import pool from './neonClient';

// واجهة المنتج
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount_price?: number;
  discount_percentage?: number;
  image_url?: string;
  stock_quantity: number;
  sizes?: string[];
  images?: string[];
  category?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// جلب جميع المنتجات
export async function getProducts(): Promise<Product[]> {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// جلب منتج واحد بواسطة ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

// إضافة منتج جديد
export async function createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  try {
    const result = await pool.query(
      `INSERT INTO products (
        name, description, price, discount_price, discount_percentage,
        image_url, stock_quantity, sizes, images, category, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, COALESCE($11, true))
      RETURNING *`,
      [
        productData.name,
        productData.description,
        productData.price,
        productData.discount_price,
        productData.discount_percentage,
        productData.image_url,
        productData.stock_quantity,
        productData.sizes ? JSON.stringify(productData.sizes) : null,
        productData.images ? JSON.stringify(productData.images) : null,
        productData.category,
        productData.is_active
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// تحديث منتج
export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  try {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // بناء الاستعلام ديناميكياً
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        // معالجة خاصة للمصفوفات
        if (Array.isArray(value)) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE products SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// حذف منتج
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1',
      [id]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// البحث في المنتجات
export async function searchProducts(filters: {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  name?: string;
}): Promise<Product[]> {
  try {
    let query = 'SELECT * FROM products WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.category) {
      query += ` AND category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.priceMin !== undefined) {
      query += ` AND price >= $${paramCount}`;
      values.push(filters.priceMin);
      paramCount++;
    }

    if (filters.priceMax !== undefined) {
      query += ` AND price <= $${paramCount}`;
      values.push(filters.priceMax);
      paramCount++;
    }

    if (filters.name) {
      query += ` AND name ILIKE $${paramCount}`;
      values.push(`%${filters.name}%`);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
} 

// واجهة العرض
export interface Offer {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount_price?: number;
  image_url?: string;
  stock_quantity: number;
  sizes?: string[];
  images?: string[];
  category?: string;
  created_at?: Date;
  updated_at?: Date;
}

export async function getOffers(): Promise<Offer[]> {
  const result = await pool.query('SELECT * FROM offers ORDER BY created_at DESC');
  return result.rows;
}

export async function getOfferById(id: string): Promise<Offer | null> {
  const result = await pool.query('SELECT * FROM offers WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createOffer(offerData: Omit<Offer, 'id' | 'created_at' | 'updated_at'>): Promise<Offer> {
  const result = await pool.query(
    `INSERT INTO offers (
      name, description, price, discount_price, image_url, stock_quantity, sizes, images, category
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [
      offerData.name,
      offerData.description,
      offerData.price,
      offerData.discount_price,
      offerData.image_url,
      offerData.stock_quantity,
      offerData.sizes ? JSON.stringify(offerData.sizes) : null,
      offerData.images ? JSON.stringify(offerData.images) : null,
      offerData.category,
    ]
  );
  return result.rows[0];
}

export async function updateOffer(id: string, offerData: Partial<Offer>): Promise<Offer | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;
  Object.entries(offerData).forEach(([k, v]) => {
    if (v !== undefined) {
      fields.push(`${k} = $${i}`);
      values.push(Array.isArray(v) ? JSON.stringify(v) : v);
      i++;
    }
  });
  if (fields.length === 0) return await getOfferById(id);
  values.push(id);
  const result = await pool.query(
    `UPDATE offers SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

export async function deleteOffer(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM offers WHERE id = $1', [id]);
  return result.rowCount > 0;
}

export async function searchOffers(filters: { category?: string; priceMin?: number; priceMax?: number; name?: string }): Promise<Offer[]> {
  let query = 'SELECT * FROM offers WHERE 1=1';
  const values: any[] = [];
  let c = 1;
  if (filters.category) { query += ` AND category = $${c++}`; values.push(filters.category); }
  if (filters.priceMin !== undefined) { query += ` AND price >= $${c++}`; values.push(filters.priceMin); }
  if (filters.priceMax !== undefined) { query += ` AND price <= $${c++}`; values.push(filters.priceMax); }
  if (filters.name) { query += ` AND name ILIKE $${c++}`; values.push(`%${filters.name}%`); }
  query += ' ORDER BY created_at DESC';
  const result = await pool.query(query, values);
  return result.rows;
}

// الطلبات
export interface OrderRow {
  id: string;
  item_type: 'product' | 'offer';
  item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  customer_name: string;
  phone_number: string;
  wilaya: string;
  commune?: string;
  delivery_type: 'home' | 'stopDesk';
  status: string;
  reseller_price?: number;
  reseller_name?: string;
  reseller_phone?: string;
  reseller_user_id?: string;
  created_at?: Date;
}

export async function createOrder(order: Omit<OrderRow, 'id' | 'created_at' | 'status'> & { status?: string }): Promise<OrderRow> {
  const result = await pool.query(
    `INSERT INTO orders (
      item_type, item_id, item_name, quantity, unit_price, subtotal, shipping_cost, total_amount,
      customer_name, phone_number, wilaya, commune, delivery_type, status, reseller_price,
      reseller_name, reseller_phone, reseller_user_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, COALESCE($14,'قيد المعالجة'), $15, $16, $17, $18) RETURNING *`,
    [
      order.item_type,
      order.item_id,
      order.item_name,
      order.quantity,
      order.unit_price,
      order.subtotal,
      order.shipping_cost,
      order.total_amount,
      order.customer_name,
      order.phone_number,
      order.wilaya,
      order.commune ?? null,
      order.delivery_type,
      order.status,
      order.reseller_price ?? null,
      order.reseller_name ?? null,
      order.reseller_phone ?? null,
      order.reseller_user_id ?? null,
    ]
  );
  return result.rows[0];
}
