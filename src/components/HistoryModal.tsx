import { useState, useEffect } from "react";
import { HistoryItem } from "../types";
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  exportHistoryToExcel,
} from "../utils/history";
import { formatCurrency, formatDate } from "../utils/format";
import {
  X,
  Trash2,
  Download,
  Clock,
  Receipt,
  AlertCircle,
  Search,
  MoreVertical,
  Eye,
  FileText,
} from "lucide-react";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHistory: (item: HistoryItem) => void;
}

export default function HistoryModal({
  isOpen,
  onClose,
  onSelectHistory,
}: HistoryModalProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    setHistory(getHistory());
  };

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    loadHistory();
  };

  const handleBulkDelete = () => {
    selectedItems.forEach((id) => deleteHistoryItem(id));
    setSelectedItems(new Set());
    setShowDeleteConfirm(false);
    loadHistory();
  };

  const handleClearAll = () => {
    clearHistory();
    setSelectedItems(new Set());
    setShowDeleteConfirm(false);
    loadHistory();
  };

  const handleExport = () => {
    const data = exportHistoryToExcel();
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-history-${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === history.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(history.map((item) => item.id)));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Riwayat Pemrosesan</h2>
                <p className="text-blue-100">
                  {history.length} invoice tersimpan
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama file..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.size > 0 && (
            <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-xl p-4">
              <span className="text-blue-800 font-medium">
                {selectedItems.size} item dipilih
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Terpilih</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={selectAll}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              {selectedItems.size === history.length
                ? "Batal Pilih Semua"
                : "Pilih Semua"}
            </button>

            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor</span>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Semua</span>
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {history.length === 0 ? "Belum Ada Riwayat" : "Tidak Ada Hasil"}
              </h3>
              <p className="text-gray-500">
                {history.length === 0
                  ? "Mulai memproses invoice untuk melihat riwayat di sini"
                  : "Coba ubah filter atau kata kunci pencarian"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {history.map((item) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onSelect={() => toggleSelectItem(item.id)}
                  onView={() => onSelectHistory(item)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Konfirmasi Hapus
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                {selectedItems.size > 0
                  ? `Apakah Anda yakin ingin menghapus ${selectedItems.size} item yang dipilih?`
                  : "Apakah Anda yakin ingin menghapus semua riwayat?"}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={
                    selectedItems.size > 0 ? handleBulkDelete : handleClearAll
                  }
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface HistoryCardProps {
  item: HistoryItem;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  onDelete: () => void;
}

function HistoryCard({
  item,
  isSelected,
  onSelect,
  onView,
  onDelete,
}: HistoryCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const hasError = !item.data;
  const items =
    item.data && Array.isArray(item.data.product_item)
      ? item.data.product_item
      : [];
  const totalAmount = items.reduce(
    (sum: number, item: { total_price?: number }) =>
      sum + (item.total_price || 0),
    0
  );

  return (
    <div
      className={`
      bg-white border-2 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg
      ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"}
      ${hasError ? "border-red-200 bg-red-50" : ""}
    `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              hasError ? "bg-red-100" : "bg-blue-100"
            }`}
          >
            {hasError ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <Receipt className="w-5 h-5 text-blue-600" />
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
              <button
                onClick={() => {
                  onView();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Lihat</span>
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 truncate">
            {item.fileName}
          </h3>
          <p className="text-sm text-gray-500">
            {formatDate(new Date(item.timestamp).toISOString())}
          </p>
        </div>

        {!hasError && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{items.length} item</span>
              <span className="font-semibold text-emerald-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        )}

        {hasError && (
          <div className="text-sm text-red-600 bg-red-100 rounded-lg p-3">
            <strong>Error: Gagal Mendeteksi Invoice</strong>
          </div>
        )}

        {item.processingTime && (
          <div className="text-xs text-gray-500">
            Diproses dalam {item.processingTime}ms
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={onView}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>Lihat Detail</span>
        </button>
      </div>
    </div>
  );
}
