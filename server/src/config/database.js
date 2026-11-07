import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data store path for local persistent storage fallback
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'devtrack-store.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadLocalStore() {
  if (fs.existsSync(STORE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8'));
    } catch {
      // Fallback if corrupted
    }
  }
  return {
    users: [],
    projects: [],
    tasks: [],
    conversations: [],
  };
}

function saveLocalStore(data) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to persist local store:', err.message);
  }
}

let localStore = loadLocalStore();

export const localDb = {
  getStore: () => localStore,
  save: () => saveLocalStore(localStore),
};

export const prisma = new PrismaClient();

export let isPostgresConnected = false;
export let isMongoConnected = false;

export async function connectDatabases() {
  console.log('[DB] Initializing database connections...');

  // 1. Check PostgreSQL via Prisma
  try {
    await prisma.$connect();
    isPostgresConnected = true;
    console.log('[DB] \x1b[32m✔ PostgreSQL (Prisma) connected successfully.\x1b[0m');
  } catch (err) {
    isPostgresConnected = false;
    console.warn(
      `[DB] \x1b[33m! PostgreSQL not reachable on ${env.DATABASE_URL.split('@')[1] || 'localhost:5432'}.\x1b[0m`
    );
    console.warn('[DB] Switching to persistent local storage engine with relational constraints.');
  }

  // 2. Check MongoDB via Mongoose
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log('[DB] \x1b[32m✔ MongoDB (Mongoose) connected successfully.\x1b[0m');
  } catch (err) {
    isMongoConnected = false;
    console.warn(
      `[DB] \x1b[33m! MongoDB not reachable on ${env.MONGODB_URI}.\x1b[0m`
    );
    console.warn('[DB] AI Conversations will persist to local JSON store.');
  }
}
