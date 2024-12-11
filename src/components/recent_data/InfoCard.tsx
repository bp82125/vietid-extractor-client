import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InfoCardProps {
  data: {
    no: string;
    full_name: string;
    date_of_birth: string;
    sex: string;
    nationality: string;
    place_of_origin: string;
    place_of_residence: string;
    date_of_expiry: string;
    createdAt: string;
  };
}

const maskSensitiveInfo = (key: string, value: string) => {
  if (key === "no") {
    return value.slice(0, -4) + "****";
  }

  if (key === "place_of_residence" || key === "place_of_origin") {
    const parts = value.split(",");
    if (parts.length > 1) {
      const maskedParts = parts.slice(0, parts.length - 1).map(() => "*****");
      return `${maskedParts.join(", ")} , ${parts[parts.length - 1].trim()}`;
    }
    return value;
  }

  if (key === "date_of_birth" || key === "date_of_expiry") {
    const parts = value.split("/");
    if (parts.length === 3) {
      return `**/**/${parts[2]}`;
    }
    return value;
  }

  return value;
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

export const InfoCard: React.FC<InfoCardProps> = ({ data }) => {
  return (
    <Card className="w-full mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{data.full_name}</h3>
          <Badge variant="default" className="text-xs">
            {new Date(data.createdAt).toLocaleDateString()}
          </Badge>
        </div>
        <div className="flex flex-col gap-x-4 gap-y-2 text-sm">
          <div className="flex justify-between w-full">
            <p className="flex space-x-1">
              <span className="font-medium">Số CCCD: </span>
              <span>{maskSensitiveInfo("no", data.no)}</span>
            </p>
            <p className="flex space-x-1">
              <span className="font-medium">Ngày hết hạn: </span>{" "}
              <span>
                {maskSensitiveInfo(
                  "date_of_expiry",
                  formatDate(data.date_of_expiry)
                )}
              </span>
            </p>
          </div>

          <div className="flex justify-between w-full">
            <p className="flex space-x-1">
              <span className="font-medium">Ngày sinh: </span>{" "}
              <span>
                {maskSensitiveInfo(
                  "date_of_birth",
                  formatDate(data.date_of_birth)
                )}
              </span>
            </p>
            <p className="flex space-x-1">
              <span className="font-medium">Giới tính: </span>{" "}
              <span>{maskSensitiveInfo("sex", data.sex)}</span>
            </p>
          </div>

          <div className="flex justify-between w-full">
            <p className="flex space-x-1">
              <span className="font-medium">Quê quán: </span>{" "}
              <span>
                {maskSensitiveInfo("place_of_residence", data.place_of_origin)}
              </span>
            </p>
            <p className="flex space-x-1">
              <span className="font-medium">Quốc tịch: </span>{" "}
              <span>{data.nationality}</span>
            </p>
          </div>

          <p className="">
            <span className="font-medium">Nơi thường trú: </span>{" "}
            <span>
              {maskSensitiveInfo("place_of_residence", data.place_of_residence)}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
