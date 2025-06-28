import { ReceiptData } from "../types";
import { formatCurrency } from "../utils/format";
import { Receipt, CreditCard, Percent, ShoppingBag } from "lucide-react";

interface SummaryTabProps {
  data: ReceiptData;
}

export default function SummaryTab({ data }: SummaryTabProps) {
  const items = Array.isArray(data.product_item) ? data.product_item : [];
  const discounts = data.product_item_discount || [];

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

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const summaryCards = [
    {
      icon: Receipt,
      label: "Subtotal",
      value: formatCurrency(subtotal),
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Percent,
      label: "Diskon",
      value: `-${formatCurrency(totalDiscount)}`,
      gradient: "from-orange-500 to-orange-600",
    },
    {
      icon: CreditCard,
      label: "Total Akhir",
      value: formatCurrency(finalTotal),
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: ShoppingBag,
      label: "Item",
      value: itemCount.toString(),
      gradient: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 opacity-80" />
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h4 className="text-sm font-medium opacity-90 uppercase tracking-wider mb-2">
                {card.label}
              </h4>
              <p className="text-2xl font-bold truncate">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
