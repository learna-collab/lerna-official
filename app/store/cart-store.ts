"use client";

import { create } from "zustand";

import { CartResponse } from "../types/marketplace";
import { CartService } from "../services/cart";

interface CartStore {
  cart: CartResponse | null;
  loading: boolean;

  loadCart: () => Promise<void>;

  addItem: (listingId: string, quantity?: number) => Promise<void>;

  updateItem: (itemId: string, quantity: number) => Promise<void>;

  removeItem: (itemId: string) => Promise<void>;

  clear: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  loading: false,

  loadCart: async () => {
    set({ loading: true });

    try {
      const cart = await CartService.getCart();

      set({ cart });
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (listingId, quantity = 1) => {
    const cart = await CartService.addItem(listingId, quantity);

    set({ cart });
  },

  updateItem: async (itemId, quantity) => {
    const cart = await CartService.updateItem(itemId, quantity);

    set({ cart });
  },

  removeItem: async (itemId) => {
    const cart = await CartService.removeItem(itemId);

    set({ cart });
  },

  clear: async () => {
    await CartService.clear();

    set({ cart: null });
  },
}));
