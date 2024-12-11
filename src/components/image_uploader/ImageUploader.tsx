"use client";

import { useState } from "react";
import { UploadForm } from "./UploadForm";
import { useExtractor } from "@/context/ExtractorContext";
import { processSSEResponse } from "@/utils/sseProcessor";
import { ServerMessage } from "@/types";

export function ImageUploader({
  setIsProcessingComplete,
  setShowRecentExtractions,
}: {
  setIsProcessingComplete: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRecentExtractions: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setServerMessages, setExtractedData } = useExtractor();

  const handleFileChange = (newFile: File | null) => {
    if (newFile) {
      setFile(newFile);
      setImagePreview(URL.createObjectURL(newFile));
      setIsProcessingComplete(false);
      setShowRecentExtractions(false);
    } else {
      setFile(null);
      setImagePreview(null);
      setIsProcessingComplete(false);
      setShowRecentExtractions(true);
    }
  };

  const handleMessage = (messageData: ServerMessage) => {
    setServerMessages((prevMessages) => [...prevMessages, messageData]);

    if (messageData.status === "completed" && messageData.data) {
      const content_text = messageData.data;
      setExtractedData({
        no: content_text[0],
        full_name: content_text[1],
        date_of_birth: content_text[2],
        sex: content_text[3],
        nationality: content_text[4],
        place_of_origin: content_text[5],
        place_of_residence: content_text.slice(6, -1).join(", "),
        date_of_expiry: content_text[content_text.length - 1],
      });
      setTimeout(() => {
        setIsProcessingComplete(true);
      }, 500);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setServerMessages([
      { status: "pending", message: "Tiến hành tải hình ảnh lên" },
    ]);
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint = `${import.meta.env.VITE_BASE_API_ENDPOINTS}/image`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Đã xảy ra lỗi trong lúc tải hình ảnh lên");
      }

      await processSSEResponse(response, handleMessage);
    } catch (error) {
      console.error("Upload hình ảnh thất bại:", error);
      setServerMessages((prev) => [
        ...prev,
        {
          status: "error",
          message: "Upload hình ảnh thất bại. Hãy thử lại sau!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <UploadForm
        onFileChange={handleFileChange}
        imagePreview={imagePreview}
        onUpload={handleUpload}
        isLoading={isLoading}
      />
    </div>
  );
}
