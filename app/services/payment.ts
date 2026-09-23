import { api } from "@/lib/api";

import {
  PaymentCheckoutResponse,
  PaymentVerificationResponse,
} from "../types/marketplace";

export class PaymentService {
  // ============================================================
  // INITIALIZE CHECKOUT PAYMENT
  // ============================================================

  static async initializeCheckout(
    checkoutId: string,
  ): Promise<PaymentCheckoutResponse> {
    const callback_url = `${window.location.origin}/marketplace/payment/success`;

    const { data } = await api.post<PaymentCheckoutResponse>(
      `/marketplace/payments/checkouts/${checkoutId}/initialize`,
      callback_url,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return data;
  }

  // ============================================================
  // VERIFY PAYMENT
  // ============================================================

  static async verify(reference: string): Promise<PaymentVerificationResponse> {
    const { data } = await api.get<PaymentVerificationResponse>(
      "/marketplace/payments/verify",
      {
        params: {
          reference,
        },
      },
    );

    return data;
  }
}
