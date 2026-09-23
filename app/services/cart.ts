import { api } from "@/lib/api";
import { CartResponse } from "../types/marketplace";

export class CartService {
  static async getCart() {
    const { data } = await api.get<CartResponse>("/marketplace/cart");
    return data;
  }

  static async addItem(listingId: string, quantity = 1) {
    const { data } = await api.post<CartResponse>("/marketplace/cart/items", {
      listing_id: listingId,
      quantity,
    });

    return data;
  }

  static async updateItem(itemId: string, quantity: number) {
    const { data } = await api.patch<CartResponse>(
      `/marketplace/cart/items/${itemId}`,
      { quantity },
    );

    return data;
  }

  static async removeItem(itemId: string) {
    const { data } = await api.delete<CartResponse>(
      `/marketplace/cart/items/${itemId}`,
    );

    return data;
  }

  static async clear() {
    await api.delete("/marketplace/cart");
  }
}
