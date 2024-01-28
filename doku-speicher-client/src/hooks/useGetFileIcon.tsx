import { FileType } from "../features/documentListing/types/DocumentListingTypes";

export const useGetFileIcon = (fileType?: FileType): JSX.Element => {
  if (fileType === undefined) {
    return <img src="" alt="Default" />;
  }

  switch (fileType) {
    case FileType.PDF:
      return <img src="src/assets/pdf-icon.png" alt="PDF" />;
    case FileType.EXCEL:
      return <img src="src/assets/xlsx-icon.png" alt="Excel" />;
    case FileType.WORD:
      return <img src="src/assets/docx-icon.png" alt="Word" />;
    case FileType.TEXT:
      return <img src="src/assets/txt-icon.png" alt="Text" />;
    case FileType.PNG:
      return <img src="src/assets/png-icon.png" alt="Image" />;
    case FileType.JPG:
      return <img src="src/assets/jpg-icon.png" alt="Image" />;
    case FileType.JPEG:
      return <img src="src/assets/jpeg-icon.png" alt="Image" />;
    default:
      return <img src="" alt="Default" />;
  }
};
