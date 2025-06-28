import React, { useState } from "react";
import { ReceiptData } from "../types";
import SummaryTab from "./SummaryTab";
import ItemsTab from "./ItemsTab";
import { BarChart3, ShoppingCart, Code, AlertCircle } from "lucide-react";

interface ResultsStepProps {
  data: ReceiptData;
}

export default function ResultsStep({ data }: ResultsStepProps) {
  const [activeTab, setActiveTab] = useState("summary");

  if (!data) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Kesalahan Pemrosesan
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-red-800">{"Gagal memproses invoice"}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "summary",
      label: "Ringkasan",
      icon: BarChart3,
      description: "Ikhtisar & metrik utama",
    },
    {
      id: "items",
      label: "Item",
      icon: ShoppingCart,
      description: "Rincian item detail",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Pemrosesan Selesai!
        </h2>
        <p className="text-gray-600 text-lg">
          Invoice Anda telah berhasil dianalisis dan diproses
        </p>
      </div>

      {/* Results Container */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-3">
            📄 Analisis Invoice
          </h3>
          <p className="text-blue-100 text-lg">
            Rincian lengkap data invoice Anda
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-2 space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium
                    ${
                      activeTab === tab.id
                        ? "bg-white text-blue-600 shadow-lg transform translate-y-[-2px]"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          {activeTab === "summary" && <SummaryTab data={data} />}
          {activeTab === "items" && <ItemsTab data={data} />}
        </div>
      </div>
    </div>
  );
}
