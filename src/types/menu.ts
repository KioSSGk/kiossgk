export interface Menu {
    menu_idx: number;
    store_idx: number;
    menu_name: string;
    menu_price: number;
    menu_detail: string | null;
    menu_category: string;
    menu_status: string;
  }
  


  
  export interface MenuItem extends Menu {
    image: string; // 이미지 경로 추가
  }