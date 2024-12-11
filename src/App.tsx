import { useState } from "react";
import { ImageUploader } from "./components/image_uploader/ImageUploader";
import { ResultForm } from "./components/image_uploader/ResultForm";
import { ExtractorProvider } from "./context/ExtractorContext";
import "./index.css";
import { RecentExtractions } from "./components/recent_data/RecentExtraction";

function App() {
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [showRecentExtractions, setShowRecentExtractions] = useState(true);

  return (
    <ExtractorProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div
          className={`w-full flex gap-6 ${
            isProcessingComplete
              ? "max-w-7xl items-start"
              : showRecentExtractions
              ? "max-w-6xl items-center"
              : "max-w-xl"
          }`}
        >
          <div className="flex-1 ">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h1 className="text-2xl font-bold mb-4">
                TRÍCH XUẤT THÔNG TIN TỪ CCCD
              </h1>
              <ImageUploader
                setIsProcessingComplete={setIsProcessingComplete}
                setShowRecentExtractions={setShowRecentExtractions}
              />
            </div>
          </div>

          {showRecentExtractions && (
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-xl p-6">
                <h1 className="text-2xl font-bold mb-4">
                  CÁC CCCD ĐƯỢC TRÍCH XUẤT GẦN ĐÂY
                </h1>
                <RecentExtractions />
              </div>
            </div>
          )}

          {isProcessingComplete && (
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-xl p-6">
                <h1 className="text-2xl font-bold mb-4">
                  THÔNG TIN ĐÃ ĐƯỢC TRÍCH XUẤT
                </h1>
                <ResultForm />
              </div>
            </div>
          )}
        </div>
      </div>
    </ExtractorProvider>
  );
}

export default App;
