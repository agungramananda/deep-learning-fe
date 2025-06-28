import React, { useRef, useEffect, useState } from "react";
import { Move, RotateCcw, Crop } from "lucide-react";

interface EditorStepProps {
  image: HTMLImageElement;
  initialPoints: [number, number][];
  onProcess: (points: [number, number][]) => void;
  isProcessing: boolean;
}

export default function EditorStep({
  image,
  initialPoints,
  onProcess,
  isProcessing,
}: EditorStepProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<[number, number][]>(initialPoints);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPointIndex, setDraggedPointIndex] = useState(-1);

  const pointRadius = 12;

  useEffect(() => {
    drawCanvas();
  }, [points, image]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container while maintaining aspect ratio
    const container = canvas.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const aspectRatio = image.height / image.width;
    const canvasWidth = Math.min(containerWidth, 800);
    const canvasHeight = canvasWidth * aspectRatio;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    // Calculate scale factors
    const scaleX = canvasWidth / image.width;
    const scaleY = canvasHeight / image.height;

    // Clear and draw image
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

    if (points.length !== 4) return;

    // Draw polygon with scaled points
    const scaledPoints = points.map(([x, y]) => [x * scaleX, y * scaleY]);

    ctx.beginPath();
    ctx.moveTo(scaledPoints[0][0], scaledPoints[0][1]);
    for (let i = 1; i < scaledPoints.length; i++) {
      ctx.lineTo(scaledPoints[i][0], scaledPoints[i][1]);
    }
    ctx.closePath();

    // Draw polygon fill with transparency
    ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
    ctx.fill();

    // Draw polygon border
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw corner points
    scaledPoints.forEach((p, index) => {
      ctx.beginPath();
      ctx.arc(p[0], p[1], pointRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add point number
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText((index + 1).toString(), p[0], p[1] + 4);
    });
  };

  const getMousePos = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = image.width / canvas.width;
    const scaleY = image.height / canvas.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const mousePos = getMousePos(event);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scaleX = canvas.width / image.width;
    const scaleY = canvas.height / image.height;

    points.forEach(([x, y], index) => {
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;
      const canvasMouseX = mousePos.x * scaleX;
      const canvasMouseY = mousePos.y * scaleY;

      const dist = Math.sqrt(
        Math.pow(scaledX - canvasMouseX, 2) +
          Math.pow(scaledY - canvasMouseY, 2)
      );

      if (dist < pointRadius) {
        setIsDragging(true);
        setDraggedPointIndex(index);
      }
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || draggedPointIndex === -1) return;

    const mousePos = getMousePos(event);
    const newPoints = [...points];
    newPoints[draggedPointIndex] = [mousePos.x, mousePos.y];
    setPoints(newPoints);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedPointIndex(-1);
  };

  const resetPoints = () => {
    setPoints(initialPoints);
  };

  const handleProcess = () => {
    onProcess(points);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Sesuaikan Sudut Invoice
        </h2>
        <p className="text-gray-600 text-lg">
          Sesuaikan posisi sudut dengan menyeret lingkaran merah untuk
          membingkai invoice Anda dengan sempurna
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Move className="w-4 h-4" />
              <span>Seret sudut bernomor untuk menyesuaikan</span>
            </div>

            <button
              onClick={resetPoints}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="border border-gray-200 rounded-xl cursor-crosshair shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-300 disabled:to-emerald-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Memproses Invoice...</span>
            </>
          ) : (
            <>
              <Crop className="w-5 h-5" />
              <span>Potong & Proses Invoice</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
