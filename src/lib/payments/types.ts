export type PaymentProviderType = 'PAYSTACK' | 'FLUTTERWAVE' | 'BANK_TRANSFER';

export interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  email: string;
  reference: string;
  metadata?: Record<string, any>;
}

export interface PaymentIntentResponse {
  reference: string;
  authorizationUrl?: string;
  provider: PaymentProviderType;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
}

export interface PaymentProvider {
  initializePayment(request: PaymentIntentRequest): Promise<PaymentIntentResponse>;
  verifyPayment(reference: string): Promise<boolean>;
}
