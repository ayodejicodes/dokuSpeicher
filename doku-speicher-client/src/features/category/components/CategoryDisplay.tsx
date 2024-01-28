import React from "react";
import CategoryCard from "./CategoryCard";
import { IconType } from "react-icons";

interface Category {
  type: string;
  count: number;
  Icon: IconType;
  fliesTotalSize: number;
}

interface CategoryDisplayProps {
  categories: Category[];
}

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({ categories }) => {
  return (
    <div className="w-full h-[35%] rounded-lg flex justify-between items-center mt-2">
      {categories.map((category) => (
        <CategoryCard
          key={category.type}
          fileType={category.type}
          fileCount={category.count}
          Icon={category.Icon}
          fliesTotalSize={category.fliesTotalSize}
        />
      ))}
    </div>
  );
};

export default CategoryDisplay;
