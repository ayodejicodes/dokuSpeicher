import { Document } from "../../../redux/slices/documentSlice";

export enum FileType {
  PDF = "pdf",
  EXCEL = "xlsx",
  WORD = "docx",
  TEXT = "txt",
  PNG = "png",
  JPG = "jpg",
  JPEG = "jpeg",
}

export type SelectedDocuments = { [key: string]: boolean };

export interface User {
  id: string;
  name: string;
}

export interface DocumentRowProps {
  document: Document;
  isSelected: boolean;
  onSelectionChange: (documentId: string) => void;
  onClick: (documentId: string) => void;
}

export type PaginationProps = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
};
