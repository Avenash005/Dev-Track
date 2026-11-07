import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = ['JWT_SECRET'];

export function validateEnv() {
  const missing = [];
  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error(`[CRITICAL] Missing required environment variables: ${missing.join(', ')}`);
    console.error(`Please configure them in server/.env using server/.env.example as template.`);
    process.exit(1);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/devtrack_db?schema=public',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/devtrack_ai',
  JWT_SECRET: process.env.JWT_SECRET || 'devtrack_ai_secret_jwt_key_9f13b92c_2026_academic_term',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'llama3.2',
};
