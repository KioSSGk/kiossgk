export interface NoticeHistory {
    notice_idx: number;
    store_idx: number;
    notice_code: string;
    notice_contents: string | null;
    view_status: boolean | null;
    notice_time: Date | null;
    menu_idx: number;
  }
  