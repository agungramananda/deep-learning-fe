export interface Point {
  x: number;
  y: number;
}

export interface ReceiptItem {
  product_name?: string;
  quantity?: number;
  price_per_item?: number;
  total_price?: number;
}

export interface ReceiptDiscount {
  discount?: number;
}

export interface ReceiptData {
  product_item: (ReceiptItem & { bbox: [number, number, number, number] })[];
  product_item_discount: (ReceiptDiscount & {
    bbox: [number, number, number, number];
  })[];
}

export interface DetectionResponse {
  points: [number, number][];
}

export interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  fileName: string;
  data: ReceiptData;
  thumbnail?: string;
  processingTime?: number;
}
