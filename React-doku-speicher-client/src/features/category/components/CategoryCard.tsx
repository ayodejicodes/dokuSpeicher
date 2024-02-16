import React from "react";
import { IconType } from "react-icons";

type FileType = "PDF" | "Excel" | "Word" | "TXT" | "Images";

interface CategoryCardProps {
  fileType: string;
  fileCount: number;
  Icon: IconType;
  fliesTotalSize: number;
}

const styleMap: {
  [key in FileType]: { borderColor: string; iconColor: string };
} = {
  PDF: { borderColor: `border-accentRed/85`, iconColor: "text-accentRed/85" },
  Excel: { borderColor: "border-excelColor", iconColor: "text-excelColor" },
  Word: { borderColor: "border-wordColor", iconColor: "text-wordColor" },
  TXT: { borderColor: "border-txtColor", iconColor: "text-txtColor" },
  Images: { borderColor: "border-imagesColor", iconColor: "text-imagesColor" },
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  fileType,
  fileCount,
  fliesTotalSize,
  Icon,
}) => {
  const styles = styleMap[fileType as FileType] || {
    borderColor: "border-gray",
    iconColor: "text-gray",
  };

  return (
    <div
      className={`border-[3px] rounded-lg p-4 flex flex-col items-start justify-between hover:shadow-md w-36 h-28 ${styles.borderColor}`}
    >
      <Icon size={28} className={`mb-2 ${styles.iconColor}`} />
      <p className="text-sm font-semibold">{fileType}</p>
      <p className="text-xs">
        {fileCount} Files -{fliesTotalSize.toFixed(2)}KB
      </p>
    </div>
  );
};

export default CategoryCard;
