export interface Order {
    order_idx: number;
    user_idx: string;
    store_idx: number;
    cart_idx: number | null;
    order_state: string | null;
    requests: string | null;
    amount: number | null;
    agency_id: string | null;
    created: Date | null;
    total_price: number | null;
    order_date: Date | null;
  }
  