"use client";

import { useState } from "react";
import { UploadForm } from "./UploadForm";
import { ServerResponse } from "./ServerResponse";
import { ServerMessage } from "@/types";

export function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [serverMessages, setServerMessages] = useState<ServerMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (newFile: File | null) => {
    if (newFile) {
      setFile(newFile);
      setImagePreview(URL.createObjectURL(newFile));
    } else {
      setFile(null);
      setImagePreview(null);
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
      const response = await fetch("http://localhost:5000/api/v1/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Đã xảy ra lỗi trong lúc tải hình ảnh lên");
      }

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += value;
        const parts = buffer.split("\n\n");

        for (let i = 0; i < parts.length - 1; i++) {
          const event = parts[i].trim();
          if (event) {
            try {
              const messageData: ServerMessage = JSON.parse(event);
              console.log("Received SSE message:", messageData);
              setServerMessages((prevMessages) => [
                ...prevMessages,
                messageData,
              ]);
            } catch (error) {
              console.error("Failed to parse message:", error);
            }
          }
        }
        buffer = parts[parts.length - 1];
      }

      if (buffer.trim()) {
        try {
          const messageData: ServerMessage = JSON.parse(buffer);
          setServerMessages((prevMessages) => [...prevMessages, messageData]);
        } catch (error) {
          console.error("Failed to parse final message:", error);
        }
      }
    } catch (error) {
      console.error("File upload failed:", error);
      setServerMessages((prev) => [
        ...prev,
        { status: "error", message: "Failed to upload file." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full">
      <div className="my-10 p-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-4">
          Trích xuất thông tin từ CCCD
        </h1>
        <UploadForm
          onFileChange={handleFileChange}
          imagePreview={imagePreview}
          onUpload={handleUpload}
          isLoading={isLoading}
        />
        {serverMessages.length > 0 && (
          <ServerResponse serverMessages={serverMessages} />
        )}
      </div>
    </div>
  );
}
