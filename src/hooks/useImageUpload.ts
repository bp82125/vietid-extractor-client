import { useState } from "react";

export const useImageUpload = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverData, setServerData] = useState<string>("");

  const uploadImage = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server response was not ok");
      }

      const data = await response.json();
      setServerData(data.result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, serverData, uploadImage };
};