import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface UploadFormProps {
  onFileChange: (file: File | null) => void;
  imagePreview: string | null;
  onUpload: () => void;
  isLoading: boolean;
}

export function UploadForm({
  onFileChange,
  imagePreview,
  onUpload,
  isLoading,
}: UploadFormProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  const handleDiscard = () => {
    onFileChange(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-upload">Chọn hình ảnh</Label>
        <Input
          id="image-upload"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="mt-1"
        />
      </div>
      {imagePreview && (
        <div className="flex justify-between items-center space-x-4">
          <div className="relative w-12 h-12 overflow-hidden rounded-md">
            <img
              src={imagePreview}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDiscard}
            aria-label="Discard image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <Button onClick={onUpload} disabled={isLoading} className="w-full">
        {isLoading ? "Đang tải..." : "Tải lên"}
      </Button>
    </div>
  );
}
