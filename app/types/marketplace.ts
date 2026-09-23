export interface CartItem {
  id: string;
  listing_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  currency: string;
}

export interface CartResponse {
  id: string;
  customer_id: string;
  items: CartItem[];
  total_items: number;
  total_amount: number;
  currency: string;
}

// ============================================================
// CHECKOUT
// ============================================================

export interface CheckoutOrder {
  id: string;
  order_number: string;
  vendor_id: string;
  total_amount: number;
  commission_amount: number;
  vendor_amount: number;
}

export interface CheckoutResponse {
  id: string;
  checkout_number: string;
  customer_id: string;
  total_amount: number;
  currency: string;
  status: string;
  orders: CheckoutOrder[];
}

// ============================================================
// PAYMENT
// ============================================================

export interface PaymentCheckoutResponse {
  checkout_id: string;
  reference: string;
  checkout_url: string;
  access_code: string;
  amount: number;
  status: string;
}

// ============================================================
// PAYMENT VERIFICATION
// ============================================================

export interface PaymentVerificationResponse {
  message: string;
  checkout_id: string;
  checkout_number: string;
  status: string;
  total_amount: number;
  currency: string;
}
export interface MarketplaceOrderItem {
  id: string;
  listing_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface MarketplaceOrder {
  id: string;
  order_number: string;
  vendor_id: string;
  checkout_id: string | null;

  total_amount: number;
  commission_amount: number;
  vendor_amount: number;

  status: string;
  delivery_confirmed: boolean;
  released: boolean;

  created_at: string;
  updated_at: string;

  items: MarketplaceOrderItem[];
}

export interface MarketplaceOrderListResponse {
  orders: MarketplaceOrder[];
  total: number;
}
