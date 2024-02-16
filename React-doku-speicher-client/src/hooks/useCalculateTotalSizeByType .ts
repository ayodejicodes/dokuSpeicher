import { useMemo } from "react";

import { bytesToKilobytes } from "./useBytesToKilobytes";
import { Document } from "../redux/slices/documentSlice";

const useCalculateTotalSizeByType = (
  documents: Document[],
  fileType: string
): number => {
  return useMemo(() => {
    const totalSizeInBytes = documents
      .filter((doc) => doc.type.toLowerCase() === fileType.toLowerCase())
      .reduce((totalSize, doc) => totalSize + (doc.fileSize || 0), 0);

    const sizeInKilobytes = bytesToKilobytes(totalSizeInBytes);

    return parseFloat(sizeInKilobytes.toFixed(2));
  }, [documents, fileType]);
};

export default useCalculateTotalSizeByType;
