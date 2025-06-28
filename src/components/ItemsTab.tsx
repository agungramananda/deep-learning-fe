import React from "react";
import { ReceiptData } from "../types";
import { formatCurrency } from "../utils/format";
import { ShoppingCart, Minus, Plus, DollarSign } from "lucide-react";

interface ItemsTabProps {
  data: ReceiptData;
}

export default function ItemsTab({ data }: ItemsTabProps) {
  const items = data.product_item || [];
  const discounts = data.product_item_discount || [];

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Tidak Ada Item Terdeteksi
        </h3>
        <p className="text-gray-500">
          Item individual tidak dapat dideteksi dalam invoice ini.
        </p>
      </div>
    );
  }

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + (item.total_price || 0),
    0
  );
  const totalDiscount = discounts.reduce(
    (sum, discount) => sum + (discount.discount || 0),
    0
  );
  const finalTotal = subtotal - totalDiscount;

  return (
    <div className="space-y-8">
      {/* Items List */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Item yang Dibeli</h3>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const name = item.product_name || "Item Tidak Diketahui";
            const quantity = item.quantity || 1;
            const pricePerItem = item.price_per_item || 0;
            const totalPrice = item.total_price || 0;

            return (
              <div
                key={index}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <span>Qty:</span>
                        <span className="font-medium">{quantity}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{formatCurrency(pricePerItem)} per item</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-600">
                      {formatCurrency(totalPrice)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discounts Section */}
      {discounts.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Minus className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-amber-900">
              Diskon yang Diterapkan
            </h3>
          </div>

          <div className="space-y-3">
            {discounts.map((discount, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">Diskon</h4>
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    -{formatCurrency(discount.discount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Totals Section */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 border-t-4 border-emerald-500">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-lg font-medium text-gray-700">Subtotal:</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(subtotal)}
            </span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-lg font-medium text-red-600">
                Total Diskon:
              </span>
              <span className="text-lg font-semibold text-red-600">
                -{formatCurrency(totalDiscount)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-4 bg-emerald-50 rounded-xl px-4 border border-emerald-200">
            <span className="text-xl font-bold text-emerald-900">
              Total Akhir:
            </span>
            <span className="text-2xl font-bold text-emerald-600">
              {formatCurrency(finalTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
