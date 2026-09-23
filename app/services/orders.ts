import { api } from "@/lib/api";

import {
  MarketplaceOrder,
  MarketplaceOrderListResponse,
} from "@/app/types/marketplace";

export class MarketplaceOrderService {
  static async getOrders(): Promise<MarketplaceOrderListResponse> {
    const { data } = await api.get<MarketplaceOrderListResponse>(
      "/marketplace/orders",
    );

    return data;
  }

  static async getOrder(orderId: string): Promise<MarketplaceOrder> {
    const { data } = await api.get<MarketplaceOrder>(
      `/marketplace/orders/${orderId}`,
    );

    return data;
  }
}
