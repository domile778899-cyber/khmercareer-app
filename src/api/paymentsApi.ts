import { apiClient } from './client';

export type PaymentType = 'subscription' | 'commission' | 'course' | 'advertising';
export type LocalPaymentMethod = 'aba' | 'wing' | 'khqr';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface PaymentRecord {
  id: string;
  type: PaymentType;
  amount: number;
  currency: string;
  method: LocalPaymentMethod | 'stripe';
  status: PaymentStatus;
  description: string;
  externalRef?: string | null;
  completedAt?: string | null;
  failReason?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface LocalPaymentInstructions {
  bankName?: string;
  service?: string;
  accountName?: string;
  accountNumber?: string;
  wingId?: string;
  merchantName?: string;
  merchantId?: string;
  amount?: string;
  reference: string;
  instructions: string;
  note?: string;
}

export interface CreateLocalPaymentRequest {
  type: PaymentType;
  amount: number;
  method: LocalPaymentMethod;
  description: string;
}

export interface CreateLocalPaymentResponse {
  payment: PaymentRecord;
  instructions: LocalPaymentInstructions;
}

export interface ConfirmLocalPaymentRequest {
  paymentId: string;
  externalRef: string;
}

export interface ConfirmLocalPaymentResponse {
  payment: PaymentRecord;
}

/**
 * Convert a USD display amount into backend cents without floating point drift.
 *
 * Args:
 *   amountUsd: User-facing USD amount, such as 19.99.
 *
 * Returns:
 *   Integer amount in cents for backend payment persistence.
 */
export function toPaymentCents(amountUsd: number): number {
  return Math.round(amountUsd * 100);
}

/**
 * Frontend adapter for KhmerCareer payment endpoints.
 */
export const paymentsApi = {
  /**
   * Create a pending local payment using ABA, Wing, or KHQR.
   */
  async createLocalPayment(request: CreateLocalPaymentRequest): Promise<CreateLocalPaymentResponse> {
    return apiClient.post<CreateLocalPaymentResponse, CreateLocalPaymentRequest>('payments/create-local', request);
  },

  /**
   * Confirm a local payment using the backend-issued payment id and reference.
   */
  async confirmLocalPayment(request: ConfirmLocalPaymentRequest): Promise<ConfirmLocalPaymentResponse> {
    return apiClient.post<ConfirmLocalPaymentResponse, ConfirmLocalPaymentRequest>('payments/confirm-local', request);
  },

  /**
   * Fetch the authenticated user's payment history.
   */
  async getHistory(page = 1, limit = 20): Promise<PaymentRecord[]> {
    return apiClient.get<PaymentRecord[]>(`payments/history?page=${page}&limit=${limit}`);
  },
};
