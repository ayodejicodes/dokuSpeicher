import { useMemo } from "react";
import { Document } from "../redux/slices/documentSlice";

const useCountFilesByType = (documents: Document[]): Record<string, number> => {
  return useMemo(() => {
    const countMap: Record<string, number> = {};

    documents.forEach((doc) => {
      const fileType = doc.type;
      countMap[fileType] = (countMap[fileType] || 0) + 1;
    });

    return countMap;
  }, [documents]);
};

export default useCountFilesByType;
