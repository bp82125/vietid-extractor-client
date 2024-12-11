import React from "react";
import { LoaderCircle, CircleCheck, CircleX } from "lucide-react";
import { useExtractor } from "@/context/ExtractorContext";

export const ServerResponse: React.FC = () => {
  const { serverMessages } = useExtractor();

  return (
    <div className="mt-4 space-y-2">
      <h2 className="text-xl font-semibold">Các bước xử lý</h2>
      {serverMessages.map((msg, index) => (
        <div key={index} className="p-3 border rounded-lg border-gray-200">
          <div className="flex justify-between space-x-1 items-center">
            <p className="flex-grow">{msg.message}</p>
            {msg.status === "error" ? (
              <CircleX className="mr-2 text-red-500 flex-shrink-0" />
            ) : index === serverMessages.length - 1 &&
              msg.status !== "completed" ? (
              <LoaderCircle className="mr-2 animate-spin flex-shrink-0" />
            ) : (
              <CircleCheck className="mr-2 text-green-500 flex-shrink-0" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
