import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

// ── Startup Validation ───────────────────────────────────────────────────────
const requiredEnvVars = ['DATABASE_URL'] as const;
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        'Check your .env file or .env.example for reference.',
    );
  }
}

export default {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  port: process.env.PORT ?? 5000,
  databaseUrl: process.env.DATABASE_URL as string,
  cors_origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS || 12),
  jwt_access_secret:
    process.env.JWT_ACCESS_SECRET || 'rts_default_access_secret_key',
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '7d',
  jwt_refresh_secret:
    process.env.JWT_REFRESH_SECRET || 'rts_default_refresh_secret_key',
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  admin_payment: {
    bkash_number: process.env.ADMIN_BKASH_NUMBER || '01700000000',
    bank_account_name:
      process.env.ADMIN_BANK_ACCOUNT_NAME || 'Food Canteen RTS BAF',
    bank_account_number:
      process.env.ADMIN_BANK_ACCOUNT_NUMBER || '1234567890123',
    bank_name:
      process.env.ADMIN_BANK_NAME || 'Sonali Bank Ltd / Trust Bank Ltd',
    bank_branch: process.env.ADMIN_BANK_BRANCH || 'Shamshernagar Branch',
    whatsapp_number: process.env.ADMIN_WHATSAPP_NUMBER || '+8801700000000',
  },
};
