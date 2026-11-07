import { paymentService } from '../services/paymentService.js';
import { apiResponse } from '../utils/apiResponse.js';

export const paymentController = {
  getPlans(req, res, next) {
    try {
      const plans = paymentService.getPlans();
      return apiResponse.success(res, plans, 'Subscription plans retrieved.');
    } catch (error) {
      next(error);
    }
  },

  async createOrder(req, res, next) {
    try {
      const { planId } = req.body;
      if (!planId) {
        return apiResponse.badRequest(res, 'planId is required (e.g. PRO, PREMIUM).');
      }
      const order = await paymentService.createOrder(req.user.id, planId);
      return apiResponse.created(res, order, 'Razorpay test order generated.');
    } catch (error) {
      next(error);
    }
  },

  async verifyPayment(req, res, next) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const result = await paymentService.verifyPayment(req.user.id, {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      return apiResponse.success(res, result, 'Payment verified and subscription updated.');
    } catch (error) {
      next(error);
    }
  },

  async handleFailure(req, res, next) {
    try {
      const { razorpay_order_id, error_code, error_description } = req.body;
      const result = await paymentService.handlePaymentFailure(req.user.id, {
        razorpay_order_id,
        error_code,
        error_description,
      });
      return apiResponse.success(res, result, 'Payment failure recorded.');
    } catch (error) {
      next(error);
    }
  },

  async getSubscription(req, res, next) {
    try {
      const data = await paymentService.getUserSubscription(req.user.id);
      return apiResponse.success(res, data, 'User subscription status retrieved.');
    } catch (error) {
      next(error);
    }
  },
};

