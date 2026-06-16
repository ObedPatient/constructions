import dotenv from 'dotenv';

dotenv.config();

function optionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: optionalEnv('DATABASE_URL'),
  jwtSecret: optionalEnv('JWT_SECRET') ?? 'dev-only-change-me',
  jwtExpiresIn: optionalEnv('JWT_EXPIRES_IN') ?? '7d',
  frontendUrl: optionalEnv('FRONTEND_URL') ?? 'http://localhost:5173',
  cloudinary: {
    cloudName: optionalEnv('CLOUDINARY_CLOUD_NAME'),
    apiKey: optionalEnv('CLOUDINARY_API_KEY'),
    apiSecret: optionalEnv('CLOUDINARY_API_SECRET'),
  },
  smtp: {
    host: optionalEnv('SMTP_HOST'),
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: optionalEnv('SMTP_USER'),
    pass: optionalEnv('SMTP_PASS'),
    from: optionalEnv('MAIL_FROM') ?? 'REAL Construction <no-reply@real.rw>',
    contactTo: optionalEnv('CONTACT_TO') ?? 'info@real.rw',
  },
  appCurrency: optionalEnv('APP_CURRENCY') ?? 'USD',
};
