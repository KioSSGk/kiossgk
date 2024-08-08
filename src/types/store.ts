export interface Store {
    store_idx: number;
    workplace_idx: number;
    admin_idx: number;
    store_name: string;
    store_number: string | null;
    store_category: string;
    sales_state: string | null;
    store_content: string | null;
    open_time: string | null; // Assuming TIME type as string
    close_time: string | null; // Assuming TIME type as string
  }
  