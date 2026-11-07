import crypto from 'crypto';
import { env } from '../config/env.js';
import { prisma, isPostgresConnected, localDb } from '../config/database.js';

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    priceFormatted: '₹0',
    amount: 0,
    currency: 'INR',
    interval: 'month',
    features: [
      'Up to 3 active projects',
      '25 tasks per project',
      'Standard JavaScript learning modules',
      'Community student support',
    ],
  },
  PRO: {
    id: 'pro',
    name: 'Pro Plan',
    price: 149,
    priceFormatted: '₹149',
    amount: 14900, // 14900 paise = ₹149
    currency: 'INR',
    interval: 'month',
    features: [
      'Unlimited projects and tasks',
      'Accelerated local Ollama AI mentorship',
      'Interactive architecture playgrounds',
      'Exportable milestone velocity reports',
      'Priority email & viva preparation support',
    ],
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium Plan',
    price: 299,
    priceFormatted: '₹299',
    amount: 29900, // 29900 paise = ₹299
    currency: 'INR',
    interval: 'month',
    features: [
      'Everything in Pro Plan included',
      '1-on-1 code review & viva defense simulator',
      'Unlimited AI conversation history & deep context',
      'Docker Compose & Microservices sandbox access',
      'Official DevTrack AI Certified Engineer badge',
    ],
  },
};

export const paymentService = {
  getPlans() {
    return Object.values(SUBSCRIPTION_PLANS);
  },

  async createOrder(userId, planId) {
    const key = (planId || '').toUpperCase();
    const plan = SUBSCRIPTION_PLANS[key];
    if (!plan || plan.price === 0) {
      const error = new Error('Invalid plan selected for payment. Only paid plans require order creation.');
      error.statusCode = 400;
      throw error;
    }

    // Generate unique Razorpay Order ID (Test mode format)
    const razorpay_order_id = `order_test_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    let paymentRecord;

    if (isPostgresConnected) {
      paymentRecord = await prisma.payment.create({
        data: {
          user_id: userId,
          razorpay_order_id,
          amount: plan.amount,
          currency: plan.currency,
          plan: plan.id,
          status: 'CREATED',
        },
      });
    } else {
      const store = localDb.getStore();
      paymentRecord = {
        id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user_id: userId,
        razorpay_order_id,
        razorpay_payment_id: null,
        razorpay_signature: null,
        amount: plan.amount,
        currency: plan.currency,
        plan: plan.id,
        status: 'CREATED',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      store.payments.unshift(paymentRecord);
      localDb.save();
    }

    return {
      orderId: razorpay_order_id,
      amount: plan.amount,
      currency: plan.currency,
      planId: plan.id,
      planName: plan.name,
      keyId: env.RAZORPAY_KEY_ID,
    };
  },

  async verifyPayment(userId, { razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      const error = new Error('Missing required payment verification parameters (order_id, payment_id, signature).');
      error.statusCode = 400;
      throw error;
    }

    // 1. Retrieve the existing payment record
    let payment;
    if (isPostgresConnected) {
      payment = await prisma.payment.findUnique({
        where: { razorpay_order_id },
      });
    } else {
      const store = localDb.getStore();
      payment = store.payments.find((p) => p.razorpay_order_id === razorpay_order_id);
    }

    if (!payment) {
      const error = new Error('Order not found or payment session expired.');
      error.statusCode = 404;
      throw error;
    }

    if (payment.user_id !== userId) {
      const error = new Error('Unauthorized: This payment order does not belong to the authenticated user.');
      error.statusCode = 403;
      throw error;
    }

    // 2. Cryptographic HMAC SHA256 signature verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    let isAuthentic = false;
    const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
    const actualBuf = Buffer.from(razorpay_signature, 'utf-8');
    if (expectedBuf.length === actualBuf.length) {
      isAuthentic = crypto.timingSafeEqual(expectedBuf, actualBuf);
    }

    if (!isAuthentic) {
      // Mark payment as FAILED
      if (isPostgresConnected) {
        await prisma.payment.update({
          where: { razorpay_order_id },
          data: {
            status: 'FAILED',
            error_code: 'SIGNATURE_MISMATCH',
            error_description: 'Cryptographic HMAC signature verification failed. Untrusted payload.',
          },
        });
      } else {
        const store = localDb.getStore();
        const p = store.payments.find((item) => item.razorpay_order_id === razorpay_order_id);
        if (p) {
          p.status = 'FAILED';
          p.error_code = 'SIGNATURE_MISMATCH';
          p.error_description = 'Cryptographic HMAC signature verification failed.';
          p.updated_at = new Date().toISOString();
          localDb.save();
        }
      }

      const error = new Error('Payment verification failed: Signature mismatch detected. Untrusted request rejected.');
      error.statusCode = 400;
      throw error;
    }

    // 3. Mark payment as SUCCESS
    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(now.getDate() + 30); // 30-day subscription duration

    let updatedPayment;
    let activeSubscription;

    if (isPostgresConnected) {
      updatedPayment = await prisma.payment.update({
        where: { razorpay_order_id },
        data: {
          razorpay_payment_id,
          razorpay_signature,
          status: 'SUCCESS',
        },
      });

      // Update or create active subscription
      const existingSub = await prisma.subscription.findFirst({
        where: { user_id: userId },
      });

      if (existingSub) {
        activeSubscription = await prisma.subscription.update({
          where: { id: existingSub.id },
          data: {
            plan: payment.plan,
            status: 'ACTIVE',
            start_date: now,
            end_date: expiryDate,
          },
        });
      } else {
        activeSubscription = await prisma.subscription.create({
          data: {
            user_id: userId,
            plan: payment.plan,
            status: 'ACTIVE',
            start_date: now,
            end_date: expiryDate,
          },
        });
      }
    } else {
      const store = localDb.getStore();
      const p = store.payments.find((item) => item.razorpay_order_id === razorpay_order_id);
      if (p) {
        p.razorpay_payment_id = razorpay_payment_id;
        p.razorpay_signature = razorpay_signature;
        p.status = 'SUCCESS';
        p.updated_at = now.toISOString();
        updatedPayment = p;
      }

      let sub = store.subscriptions.find((item) => item.user_id === userId);
      if (sub) {
        sub.plan = payment.plan;
        sub.status = 'ACTIVE';
        sub.start_date = now.toISOString();
        sub.end_date = expiryDate.toISOString();
        sub.updated_at = now.toISOString();
        activeSubscription = sub;
      } else {
        sub = {
          id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          user_id: userId,
          plan: payment.plan,
          status: 'ACTIVE',
          start_date: now.toISOString(),
          end_date: expiryDate.toISOString(),
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
        };
        store.subscriptions.unshift(sub);
        activeSubscription = sub;
      }
      localDb.save();
    }

    return {
      verified: true,
      message: `Successfully upgraded to ${payment.plan} Plan.`,
      subscription: activeSubscription,
      payment: updatedPayment,
    };
  },

  async handlePaymentFailure(userId, { razorpay_order_id, error_code, error_description }) {
    if (isPostgresConnected) {
      await prisma.payment.updateMany({
        where: { razorpay_order_id, user_id: userId },
        data: {
          status: 'FAILED',
          error_code: error_code || 'PAYMENT_FAILED',
          error_description: error_description || 'Payment was cancelled or rejected by issuing bank.',
        },
      });
    } else {
      const store = localDb.getStore();
      const p = store.payments.find(
        (item) => item.razorpay_order_id === razorpay_order_id && item.user_id === userId
      );
      if (p) {
        p.status = 'FAILED';
        p.error_code = error_code || 'PAYMENT_FAILED';
        p.error_description = error_description || 'Payment rejected.';
        p.updated_at = new Date().toISOString();
        localDb.save();
      }
    }
    return { success: true, message: 'Payment failure logged.' };
  },

  async getUserSubscription(userId) {
    let sub;
    let paymentHistory = [];

    if (isPostgresConnected) {
      sub = await prisma.subscription.findFirst({
        where: { user_id: userId },
      });
      paymentHistory = await prisma.payment.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        take: 10,
      });
    } else {
      const store = localDb.getStore();
      sub = store.subscriptions.find((item) => item.user_id === userId);
      paymentHistory = store.payments
        .filter((item) => item.user_id === userId)
        .slice(0, 10);
    }

    const currentPlanId = sub?.status === 'ACTIVE' ? sub.plan : 'FREE';
    const planDetails = SUBSCRIPTION_PLANS[currentPlanId] || SUBSCRIPTION_PLANS.FREE;

    return {
      subscription: sub || {
        plan: 'FREE',
        status: 'ACTIVE',
        start_date: new Date().toISOString(),
        end_date: null,
      },
      planDetails,
      paymentHistory,
    };
  },
};
