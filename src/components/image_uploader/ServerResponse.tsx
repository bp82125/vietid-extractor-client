import React, { useState, useEffect } from "react";
import { LoaderCircle, CircleCheck, CircleX, Copy } from "lucide-react";
import { ServerResponseProps, ServerMessage } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const ServerResponse: React.FC<ServerResponseProps> = ({
  serverMessages,
}) => {
  const { toast } = useToast();
  const [editableMessages, setEditableMessages] = useState<ServerMessage[]>([]);

  useEffect(() => {
    setEditableMessages(serverMessages);
  }, [serverMessages]);

  const handleTextChange = (index: number, newText: string) => {
    const updatedMessages = [...editableMessages];
    if (updatedMessages[index].data) {
      updatedMessages[index].data = newText.split("\n");
    }
    setEditableMessages(updatedMessages);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Đã sao chép!",
        description: "Nội dung đã được sao chép vào bộ nhớ tạm.",
        duration: 3000,
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Sao chép thất bại",
        description: "Không thể sao chép nội dung vào bộ nhớ tạm",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {editableMessages.map((msg, index) => (
        <div key={index} className="p-3 border rounded-lg border-gray-200">
          <div className="flex justify-between items-center">
            <p>{msg.message}</p>
            {msg.status === "error" ? (
              <CircleX className="mr-2 text-red-500" />
            ) : index === editableMessages.length - 1 &&
              msg.status !== "completed" ? (
              <LoaderCircle className="mr-2 animate-spin" />
            ) : (
              <CircleCheck className="mr-2 text-green-500" />
            )}
          </div>

          {msg.data && msg.data.length > 0 && (
            <div className="mt-4 relative">
              <Textarea
                className="w-full resize-none bg-muted pr-10"
                value={msg.data.join("\n")}
                rows={Math.min(msg.data.length, 10)}
                onChange={(e) => handleTextChange(index, e.target.value)}
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2"
                onClick={() => msg.data && copyToClipboard(msg.data.join("\n"))}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy to clipboard</span>
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
