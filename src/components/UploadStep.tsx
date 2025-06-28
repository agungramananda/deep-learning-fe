import React, { useRef, useState } from "react";
import { Upload, Zap, AlertCircle } from "lucide-react";
import { detectEdges } from "../utils/api";

interface UploadStepProps {
  onImageUploaded: (
    file: File,
    base64: string,
    image: HTMLImageElement
  ) => void;
  onEdgesDetected: (points: [number, number][]) => void;
  onError: (error: string) => void;
}

export default function UploadStep({
  onImageUploaded,
  onEdgesDetected,
  onError,
}: UploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(
    null
  );
  const [base64Image, setBase64Image] = useState<string>("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setBase64Image(base64);

      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
        onImageUploaded(file, base64, img);
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  };

  const handleDetectEdges = async () => {
    if (!uploadedFile) return;

    setIsDetecting(true);
    try {
      const points = await detectEdges(uploadedFile);
      onEdgesDetected(points);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Gagal mendeteksi tepi");
    } finally {
      setIsDetecting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Unggah Invoice Anda
        </h2>
        <p className="text-gray-600 text-lg">
          Mulai dengan mengunggah gambar invoice yang jelas untuk diproses
        </p>
      </div>

      <div
        onClick={triggerFileInput}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {uploadedFile
                ? uploadedFile.name
                : "Klik untuk mengunggah gambar invoice"}
            </p>
            <p className="text-sm text-gray-500">
              Mendukung format PNG, JPEG, dan WebP
            </p>
          </div>
        </div>
      </div>

      {uploadedFile && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Upload className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">
                Gambar Berhasil Diunggah
              </h3>
              <p className="text-green-700 text-sm">{uploadedFile.name}</p>
            </div>
          </div>

          <button
            onClick={handleDetectEdges}
            disabled={isDetecting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-300 disabled:to-blue-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg"
          >
            {isDetecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Mendeteksi Tepi...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Deteksi Tepi Invoice</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Tips untuk hasil terbaik:</p>
            <ul className="space-y-1 text-amber-700">
              <li>
                • Pastikan invoice terkena cahaya yang baik dan terlihat jelas
              </li>
              <li>• Hindari bayangan dan pantulan cahaya</li>
              <li>• Sertakan seluruh bagian invoice dalam gambar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
