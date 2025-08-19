import { Pool } from 'pg';

// تكوين اتصال Neon Database
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
