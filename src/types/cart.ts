export interface Cart {
    cart_idx: number;
    user_idx: string;
    store_idx: number;
    menu_idx: number;
    option_idx: number[];
    count: number | null;
  }
  
  export interface CartItem {
    menu_idx: number;
    option_idx: number[];
    count: number;
  }

  export interface CartRequest {
    user_idx: string;
    store_idx: number;
    items: CartItem[];
  }