import React, { useState } from "react";
import { ReceiptData, ProcessingStep, HistoryItem } from "./types";
import { processReceipt } from "./utils/api";
import { saveToHistory } from "./utils/history";
import StepIndicator from "./components/StepIndicator";
import UploadStep from "./components/UploadStep";
import EditorStep from "./components/EditorStep";
import ResultsStep from "./components/ResultsStep";
import HistoryModal from "./components/HistoryModal";
import { Scan, AlertCircle, Clock } from "lucide-react";

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Data states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string>("");
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [detectedPoints, setDetectedPoints] = useState<[number, number][]>([]);
  const [results, setResults] = useState<ReceiptData | null>(null);
  const [processingStartTime, setProcessingStartTime] = useState<number>(0);

  const steps: ProcessingStep[] = [
    {
      id: "upload",
      title: "Unggah",
      description: "Pilih gambar invoice",
      completed: currentStep > 0,
      active: currentStep === 0,
    },
    {
      id: "edit",
      title: "Sesuaikan",
      description: "Atur sudut invoice",
      completed: currentStep > 1,
      active: currentStep === 1,
    },
    {
      id: "results",
      title: "Hasil",
      description: "Lihat analisis",
      completed: currentStep > 2,
      active: currentStep === 2,
    },
  ];

  const handleImageUploaded = (
    file: File,
    base64: string,
    img: HTMLImageElement
  ) => {
    setUploadedFile(file);
    setBase64Image(base64);
    setImage(img);
    setError(null);
  };

  const handleEdgesDetected = (points: [number, number][]) => {
    setDetectedPoints(points);
    setCurrentStep(1);
  };

  const handleProcess = async (points: [number, number][]) => {
    if (!base64Image || !uploadedFile) return;

    setIsProcessing(true);
    setError(null);
    setProcessingStartTime(Date.now());

    try {
      const data = await processReceipt(base64Image, points);

      setResults(data);
      setCurrentStep(2);
      const thumbnail = generateThumbnail();

      saveToHistory(uploadedFile.name, data, thumbnail);
    } catch (error) {
      const errorMessage = "Gagal memproses invoice";
      const processingTime = Date.now() - processingStartTime;

      setError(errorMessage);
      setResults(null);
      setCurrentStep(2);

      if (uploadedFile) {
        saveToHistory(
          uploadedFile.name,
          { error: errorMessage } as any,
          undefined,
          processingTime
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const generateThumbnail = (): string => {
    if (!image) return "";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // Set thumbnail size
    const maxSize = 200;
    const ratio = Math.min(maxSize / image.width, maxSize / image.height);
    canvas.width = image.width * ratio;
    canvas.height = image.height * ratio;

    // Draw scaled image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.7);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleSelectHistory = (historyItem: HistoryItem) => {
    setResults(historyItem.data as ReceiptData);
    setCurrentStep(2);
    setShowHistory(false);
    setError(!historyItem.data ? "Data tidak ditemukan" : null);
  };
  const resetApp = () => {
    setCurrentStep(0);
    setError(null);
    setIsProcessing(false);
    setUploadedFile(null);
    setBase64Image("");
    setImage(null);
    setDetectedPoints([]);
    setResults(null);
    setProcessingStartTime(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Scan className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Pemroses Invoice
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Deteksi Invoice dengan Yolov8 dan Tesseract OCR
          </p>

          {/* History Button */}
          <div className="mt-8">
            <button
              onClick={() => setShowHistory(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Clock className="w-5 h-5" />
              <span>Lihat Riwayat</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    Kesalahan Pemrosesan
                  </h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <StepIndicator steps={steps} />

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8 lg:p-12">
            {currentStep === 0 && (
              <UploadStep
                onImageUploaded={handleImageUploaded}
                onEdgesDetected={handleEdgesDetected}
                onError={handleError}
              />
            )}

            {currentStep === 1 && image && (
              <EditorStep
                image={image}
                initialPoints={detectedPoints}
                onProcess={handleProcess}
                isProcessing={isProcessing}
              />
            )}

            {currentStep === 2 && results && <ResultsStep data={results} />}
          </div>
        </div>

        {/* Reset Button */}
        {currentStep > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={resetApp}
              className="px-8 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors duration-200 font-medium"
            >
              ← Proses Invoice Lainnya
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>Project Akhir Pengantar Deep Learning - Kelompok 1</p>
        </div>
      </div>

      {/* History Modal */}
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectHistory={handleSelectHistory}
      />
    </div>
  );
}

export default App;
