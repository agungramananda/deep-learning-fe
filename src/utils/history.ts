import { HistoryItem, ReceiptData } from "../types";
import * as XLSX from "xlsx";

const HISTORY_KEY = "receipt_processing_history";
const MAX_HISTORY_ITEMS = 50;

export function saveToHistory(
  fileName: string,
  data: ReceiptData,
  thumbnail?: string,
  processingTime?: number
): void {
  const historyItem: HistoryItem = {
    id: generateId(),
    timestamp: Date.now(),
    fileName,
    data,
    thumbnail,
    processingTime,
  };

  const history = getHistory();
  history.unshift(historyItem);

  if (history.length > MAX_HISTORY_ITEMS) {
    history.splice(MAX_HISTORY_ITEMS);
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading history:", error);
    return [];
  }
}

export function deleteHistoryItem(id: string): void {
  const history = getHistory();
  const filtered = history.filter((item) => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function getHistoryItem(id: string): HistoryItem | null {
  const history = getHistory();
  return history.find((item) => item.id === id) || null;
}

export function exportHistoryToExcel(): Blob {
  const history = getHistory();
  const data = history.flatMap((item) => {
    const items = Array.isArray(item.data.product_item)
      ? item.data.product_item
      : [];
    const discounts = item.data.product_item_discount || [];

    const subtotal = items.reduce(
      (sum, prod) => sum + (prod.total_price || 0),
      0
    );
    const totalDiscount = discounts.reduce(
      (sum, discount) => sum + (discount.discount || 0),
      0
    );
    const finalTotal = subtotal - totalDiscount;

    return items.map((prod) => ({
      Tanggal: new Date(item.timestamp).toLocaleString(),
      "Nama File": item.fileName,
      "Nama Item": prod.product_name,
      Jumlah: prod.quantity,
      "Harga Satuan": prod.price_per_item,
      "Total Harga": prod.total_price,
      Subtotal: subtotal,
      "Total Discount": totalDiscount,
      "Final Total": finalTotal,
    }));
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "History");

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob([wbout], { type: "application/octet-stream" });
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getStorageUsage(): { used: number; percentage: number } {
  try {
    const historyData = localStorage.getItem(HISTORY_KEY) || "";
    const used = new Blob([historyData]).size;
    const maxStorage = 5 * 1024 * 1024; // 5MB estimate for localStorage
    const percentage = (used / maxStorage) * 100;
    return { used, percentage };
  } catch (error) {
    return { used: 0, percentage: 0 };
  }
}
