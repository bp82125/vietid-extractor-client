import React, { useEffect, useState } from "react";
import { InfoCard } from "./InfoCard";

interface ExtractionData {
  _id: string;
  no: string;
  full_name: string;
  date_of_birth: string;
  sex: string;
  nationality: string;
  place_of_origin: string;
  place_of_residence: string;
  date_of_expiry: string;
  createdAt: string;
}

export const RecentExtractions: React.FC = () => {
  const [extractions, setExtractions] = useState<ExtractionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/data");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setExtractions(result.data);
      } catch (err) {
        setError("Failed to load recent extractions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-center italic">Đang load dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      {extractions.map((extraction) => (
        <InfoCard key={extraction._id} data={extraction} />
      ))}
    </div>
  );
};
