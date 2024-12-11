import React, { createContext, useState, useContext } from "react";
import { ServerMessage } from "@/types";

type ExtractedDataKey =
  | "no"
  | "full_name"
  | "date_of_birth"
  | "sex"
  | "nationality"
  | "place_of_origin"
  | "place_of_residence"
  | "date_of_expiry";

type ExtractedData = Record<ExtractedDataKey, string>;

interface ExtractorContextType {
  serverMessages: ServerMessage[];
  setServerMessages: React.Dispatch<React.SetStateAction<ServerMessage[]>>;
  extractedData: ExtractedData;
  setExtractedData: React.Dispatch<React.SetStateAction<ExtractedData>>;
}

const ExtractorContext = createContext<ExtractorContextType | undefined>(
  undefined
);

export const ExtractorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [serverMessages, setServerMessages] = useState<ServerMessage[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    no: "",
    full_name: "",
    date_of_birth: "",
    sex: "",
    nationality: "",
    place_of_origin: "",
    place_of_residence: "",
    date_of_expiry: "",
  });

  return (
    <ExtractorContext.Provider
      value={{
        serverMessages,
        setServerMessages,
        extractedData,
        setExtractedData,
      }}
    >
      {children}
    </ExtractorContext.Provider>
  );
};

export const useExtractor = () => {
  const context = useContext(ExtractorContext);
  if (context === undefined) {
    throw new Error("useExtractor must be used within an ExtractorProvider");
  }
  return context;
};
