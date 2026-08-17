import { PaymentProvider, PaymentIntentRequest, PaymentIntentResponse, PaymentProviderType } from './types';

// Mock implementations for Paystack and Flutterwave

class PaystackProvider implements PaymentProvider {
  async initializePayment(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    console.log(`[PAYSTACK] Initializing payment for ${request.reference}`);
    return {
      reference: request.reference,
      authorizationUrl: `https://checkout.paystack.com/${request.reference}`,
      provider: 'PAYSTACK',
      status: 'PENDING'
    };
  }

  async verifyPayment(reference: string): Promise<boolean> {
    console.log(`[PAYSTACK] Verifying payment ${reference}`);
    return true; // Mock success
  }
}

class FlutterwaveProvider implements PaymentProvider {
  async initializePayment(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    console.log(`[FLUTTERWAVE] Initializing payment for ${request.reference}`);
    return {
      reference: request.reference,
      authorizationUrl: `https://checkout.flutterwave.com/${request.reference}`,
      provider: 'FLUTTERWAVE',
      status: 'PENDING'
    };
  }

  async verifyPayment(reference: string): Promise<boolean> {
    console.log(`[FLUTTERWAVE] Verifying payment ${reference}`);
    return true; // Mock success
  }
}

class BankTransferProvider implements PaymentProvider {
  async initializePayment(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    console.log(`[BANK_TRANSFER] Initializing payment for ${request.reference}`);
    return {
      reference: request.reference,
      provider: 'BANK_TRANSFER',
      status: 'PENDING'
    };
  }

  async verifyPayment(reference: string): Promise<boolean> {
    console.log(`[BANK_TRANSFER] Verifying payment ${reference} (Manual review needed)`);
    return false; // Requires admin manual verification
  }
}

export function getPaymentProvider(type: PaymentProviderType): PaymentProvider {
  switch (type) {
    case 'PAYSTACK':
      return new PaystackProvider();
    case 'FLUTTERWAVE':
      return new FlutterwaveProvider();
    case 'BANK_TRANSFER':
      return new BankTransferProvider();
    default:
      throw new Error(`Unsupported payment provider type: ${type}`);
  }
}
