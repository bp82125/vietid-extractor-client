"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useExtractor } from "@/context/ExtractorContext";
import { Copy, Download, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ExtractedDataKey =
  | "no"
  | "full_name"
  | "date_of_birth"
  | "sex"
  | "nationality"
  | "place_of_origin"
  | "place_of_residence"
  | "date_of_expiry";

const labels: Record<ExtractedDataKey, string> = {
  no: "Số / No",
  full_name: "Họ và tên / Full name",
  date_of_birth: "Ngày sinh / Date of birth",
  sex: "Giới tính / Sex",
  nationality: "Quốc tịch / Nationality",
  place_of_origin: "Quê quán / Place of origin",
  place_of_residence: "Nơi thường trú / Place of residence",
  date_of_expiry: "Có giá trị đến / Date of expiry",
};

const formatDate = (dateString: string) => {
  if (!/\d/.test(dateString)) {
    return dateString;
  }
  const dateParts = dateString.split(" ");
  return dateParts.length === 3
    ? `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`
    : dateString;
};

export function ResultForm() {
  const { extractedData, setExtractedData } = useExtractor();
  const [rawValue, setRawValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const newRawValue = Object.entries(extractedData)
      .map(([key, value]) => {
        if (key === "date_of_birth" || key === "date_of_expiry") {
          value = formatDate(value);
        }
        return `${labels[key as ExtractedDataKey]}: ${value}`;
      })
      .join("\n");
    setRawValue(newRawValue);
  }, [extractedData]);

  const handleInputChange = (key: ExtractedDataKey, value: string) => {
    setExtractedData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRawValueChange = (newRawValue: string) => {
    setRawValue(newRawValue);
    const newExtractedData = { ...extractedData };

    newRawValue.split("\n").forEach((line) => {
      const [label, rawValue] = line.split(": ");
      const key = Object.entries(labels).find(([_, l]) => l === label)?.[0] as
        | ExtractedDataKey
        | undefined;
      if (key) {
        let valueToAssign = rawValue || "";
        if (key === "date_of_birth" || key === "date_of_expiry") {
          valueToAssign = formatDate(valueToAssign);
        }
        newExtractedData[key] = valueToAssign;
      }
    });

    setExtractedData(newExtractedData);
  };

  const handleDownloadJSON = async () => {
    const dataStr = JSON.stringify(extractedData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });

    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: `${extractedData.no}.json`,
        types: [
          {
            description: "JSON file",
            accept: { "application/json": [".json"] },
          },
        ],
      });

      const writableStream = await fileHandle.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
      toast({
        title: "Tải về",
        description: `File ${fileHandle.name} đã được lưu thành công`,
      });
    } catch (error) {
      console.error("File save was canceled or failed:", error);
    }
  };

  const handleSaveResult = async () => {
    setIsSaving(true);
    try {
      const endpoint = `${import.meta.env.VITE_BASE_API_ENDPOINTS}/data`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(extractedData),
      });

      if (response.ok) {
        console.log("Data saved successfully!");
        toast({
          title: "Lưu kết quả",
          description: "Nội dung đã được lưu thành công!",
        });
        setSaveDisabled(true);
      } else {
        console.error("Failed to save data");
        toast({
          title: "Thất bại",
          description: "Lưu nội dung kết quả thất bại. Vui lòng thử lại!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Lỗi lưu kết quả",
        description:
          "Đã xảy ra lỗi trong quá trình lưu thông tin. Vui lòng thử lại!",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(rawValue);
      toast({
        title: "Sao chép thành công",
        description: "Nội dung đã được sao chép vào clipboard!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Lỗi sao chép",
        description:
          "Không thể sao chép nội dung vào clipboard. Vui lòng thử lại!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(extractedData) as ExtractedDataKey[]).map((key) => (
            <div
              key={key}
              className={`space-y-2 ${
                key === "sex" || key === "nationality"
                  ? "col-span-1"
                  : "md:col-span-2"
              }`}
            >
              <Label htmlFor={key}>{labels[key]}</Label>
              <Input
                id={key}
                value={
                  key === "date_of_birth" || key === "date_of_expiry"
                    ? formatDate(extractedData[key])
                    : extractedData[key]
                }
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <Label htmlFor="raw-value">Kết quả gốc</Label>
        <div className="relative">
          <Textarea
            id="raw-value"
            value={rawValue}
            onChange={(e) => handleRawValueChange(e.target.value)}
            rows={10}
            className="resize-none"
          />
          <button
            type="button"
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-2 rounded-md hover:bg-gray-100"
            aria-label="Đã sao chép vào bộ nhớ tạm"
          >
            <Copy className="w-4 h-4  " />
          </button>
        </div>
      </div>
      <div className="flex space-x-2 mt-4 w-full">
        <Button
          className="w-full"
          variant="secondary"
          onClick={handleDownloadJSON}
        >
          <Download className="w-4 h-4  " />
          Tải về (JSON)
        </Button>
        <Button
          className="w-full"
          onClick={handleSaveResult}
          disabled={isSaving || saveDisabled}
        >
          {isSaving ? (
            "Đang xử lý"
          ) : (
            <>
              <Save className="w-4 h-4" /> Lưu kết quả
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
