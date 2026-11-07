import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma, isPostgresConnected, localDb } from '../config/database.js';
import { env } from '../config/env.js';

export const authService = {
  async register({ name, email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user already exists
    if (isPostgresConnected) {
      const existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (existing) {
        const error = new Error('A user with this email address already exists.');
        error.statusCode = 409;
        throw error;
      }
    } else {
      const store = localDb.getStore();
      const existing = store.users.find((u) => u.email === normalizedEmail);
      if (existing) {
        const error = new Error('A user with this email address already exists.');
        error.statusCode = 409;
        throw error;
      }
    }

    // 2. Hash password with bcrypt salt
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    let newUser;

    // 3. Persist user
    if (isPostgresConnected) {
      newUser = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          password_hash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          created_at: true,
        },
      });
    } else {
      const store = localDb.getStore();
      const userRecord = {
        id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name,
        email: normalizedEmail,
        password_hash,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      store.users.push(userRecord);
      localDb.save();

      newUser = {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        created_at: userRecord.created_at,
      };
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return { user: newUser, token };
  },

  async login({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();
    let userRecord;

    // 1. Retrieve user with password hash
    if (isPostgresConnected) {
      userRecord = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    } else {
      const store = localDb.getStore();
      userRecord = store.users.find((u) => u.email === normalizedEmail);
    }

    if (!userRecord) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    // 2. Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, userRecord.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    // 3. Issue JWT
    const safeUser = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      created_at: userRecord.created_at,
    };

    const token = jwt.sign(
      { id: safeUser.id, email: safeUser.email, name: safeUser.name },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return { user: safeUser, token };
  },

  async getMe(userId) {
    if (isPostgresConnected) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          created_at: true,
        },
      });
      if (!user) {
        const error = new Error('User profile not found.');
        error.statusCode = 404;
        throw error;
      }
      return user;
    } else {
      const store = localDb.getStore();
      const user = store.users.find((u) => u.id === userId);
      if (!user) {
        const error = new Error('User profile not found.');
        error.statusCode = 404;
        throw error;
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      };
    }
  },
};
