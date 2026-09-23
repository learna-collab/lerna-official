import { api } from "@/lib/api";
import { CheckoutResponse } from "../types/marketplace";

export class CheckoutService {
  static async create() {
    const { data } = await api.post<CheckoutResponse>("/marketplace/checkout");

    return data;
  }

  static async get(checkoutId: string) {
    const { data } = await api.get<CheckoutResponse>(
      `/marketplace/checkout/${checkoutId}`,
    );

    return data;
  }
}
