/**
 * KhmerCareer Express — Payments API
 * Handles Stripe payment intents, local payment methods (KHQR, Wing, ABA),
 * payment confirmation, and payment history.
 */

import { get, post } from './client';
import { KhmerCareerAPIError } from './client';

// =============================================================================
// Payment TypeScript Interfaces
// =============================================================================

/** Supported payment types for job postings and promotions */
export type PaymentType =
  | 'job_post'
  | 'featured_job'
  | 'subscription_monthly'
  | 'subscription_yearly'
  | 'course_enrollment'
  | 'promotion';

/** Supported local payment methods in Cambodia */
export type LocalPaymentMethod = 'khqr' | 'wing' | 'aba' | 'acleda' | 'true_money';

/** Payment status lifecycle */
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

/** Stripe payment intent response */
export interface StripeIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
}

/** Request to create a Stripe payment intent */
export interface CreateStripeIntentRequest {
  type: PaymentType;
  amount: number;
  description?: string;
  metadata?: Record<string, string | number | boolean>;
}

/** Request to confirm a payment */
export interface ConfirmPaymentRequest {
  paymentIntentId: string;
}

/** Response after payment confirmation */
export interface ConfirmPaymentResponse {
  success: boolean;
  paymentIntentId: string;
  status: PaymentStatus;
  message?: string;
}

/** Request to create a local payment (KHQR, Wing, ABA, etc.) */
export interface CreateLocalPaymentRequest {
  type: PaymentType;
  amount: number;
  method: LocalPaymentMethod;
  description?: string;
  metadata?: Record<string, string | number | boolean>;
}

/** Local payment response with payment details */
export interface LocalPaymentResponse {
  paymentId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  method: LocalPaymentMethod;
  /** KHQR base64-encoded PNG image string for QR code scanning */
  qrCode?: string;
  /** Deep link URL for mobile banking apps */
  deepLink?: string;
  /** Transaction reference number */
  referenceNumber: string;
  /** Expiry timestamp for the payment session */
  expiresAt: string;
  /** Human-readable payment instructions */
  instructions?: string;
}

/** Single payment history record */
export interface PaymentRecord {
  id: string;
  paymentIntentId?: string;
  type: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: 'stripe' | LocalPaymentMethod;
  description: string;
  metadata?: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

/** Payment history response */
export interface PaymentHistoryResponse {
  payments: PaymentRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Subscription plan details */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

/** Subscription status response */
export interface SubscriptionStatus {
  active: boolean;
  plan?: SubscriptionPlan;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
}

// =============================================================================
// Payments API
// =============================================================================

export const paymentsApi = {
  /**
   * Create a Stripe PaymentIntent for card payments.
   * Returns a clientSecret required by Stripe Elements on the frontend.
   */
  async createStripeIntent(
    type: PaymentType,
    amount: number,
    description?: string,
    metadata?: Record<string, string | number | boolean>,
  ): Promise<StripeIntentResponse> {
    const payload: CreateStripeIntentRequest = {
      type,
      amount,
      description,
      metadata,
    };
    return post<StripeIntentResponse>('/payments/create-intent', payload);
  },

  /**
   * Confirm a Stripe payment after the user completes the flow.
   * Call this after stripe.confirmPayment() succeeds on the client.
   */
  async confirmPayment(paymentIntentId: string): Promise<ConfirmPaymentResponse> {
    const payload: ConfirmPaymentRequest = { paymentIntentId };
    return post<ConfirmPaymentResponse>('/payments/confirm', payload);
  },

  /**
   * Create a local payment using Cambodia-specific methods:
   * - khqr: Universal KHQR code (Bakong)
   * - wing: Wing Money
   * - aba: ABA Bank transfer
   * - acleda: ACLEDA Bank
   * - true_money: True Money
   */
  async createLocalPayment(
    type: PaymentType,
    amount: number,
    method: LocalPaymentMethod,
    description?: string,
    metadata?: Record<string, string | boolean | number>,
  ): Promise<LocalPaymentResponse> {
    const payload: CreateLocalPaymentRequest = {
      type,
      amount,
      method,
      description,
      metadata,
    };
    return post<LocalPaymentResponse>('/payments/create-local', payload);
  },

  /**
   * Poll the status of a local payment by its paymentId.
   * Useful for checking if a KHQR/Wing payment has been completed.
   */
  async getLocalPaymentStatus(paymentId: string): Promise<LocalPaymentResponse> {
    return get<LocalPaymentResponse>(`/payments/local-status/${paymentId}`);
  },

  /**
   * Get paginated payment history for the authenticated user.
   */
  async getPaymentHistory(page = 1, limit = 10): Promise<PaymentHistoryResponse> {
    return get<PaymentHistoryResponse>(`/payments/history?page=${page}&limit=${limit}`);
  },

  /**
   * Get the current user's subscription status.
   */
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    return get<SubscriptionStatus>('/payments/subscription');
  },

  /**
   * Cancel the current subscription at period end.
   */
  async cancelSubscription(): Promise<{ success: boolean; message: string }> {
    return post<{ success: boolean; message: string }>('/payments/subscription/cancel');
  },

  /**
   * Get available subscription plans.
   */
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return get<SubscriptionPlan[]>('/payments/plans');
  },

  /**
   * Verify a local payment webhook/manual confirmation.
   * Used after the user confirms they've completed a bank transfer.
   */
  async verifyLocalPayment(
    paymentId: string,
    verificationData?: { transactionRef?: string; proofImage?: string },
  ): Promise<ConfirmPaymentResponse> {
    return post<ConfirmPaymentResponse>(`/payments/verify-local/${paymentId}`, verificationData);
  },

  /**
   * Request a refund for a completed payment.
   * Admin approval may be required.
   */
  async requestRefund(paymentId: string, reason?: string): Promise<ConfirmPaymentResponse> {
    return post<ConfirmPaymentResponse>(`/payments/refund/${paymentId}`, { reason });
  },
};

export default paymentsApi;
