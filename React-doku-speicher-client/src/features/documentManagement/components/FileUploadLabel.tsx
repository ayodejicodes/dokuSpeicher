import React from "react";
import { MdOutlineFileUpload } from "react-icons/md";

interface FileUploadLabelProps {
  selectedFiles: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileUploadText: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileUploadLabel: React.FC<FileUploadLabelProps> = ({
  selectedFiles,
  handleFileChange,
  fileUploadText,
  fileInputRef,
}) => {
  const validateFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const allowedExtensions = [
      ".pdf",
      ".docx",
      ".xlsx",
      ".jpg",
      ".jpeg",
      ".png",
      ".txt",
    ];
    const files = Array.from(event.target.files || []);

    const allFilesValid = files.every((file) => {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      return allowedExtensions.includes(fileExtension);
    });

    if (!allFilesValid) {
      alert("Some files have an invalid format and will not be processed.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    handleFileChange(event);
  };

  return (
    <label className="w-full bg-primaryColorLight h-[65%] rounded-lg border-accentBlue/30 border-dashed border-4 flex flex-col justify-center items-center cursor-pointer">
      {!selectedFiles && (
        <MdOutlineFileUpload size={30} className="text-accentBlue" />
      )}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={validateFiles}
        accept=".pdf, .docx, .xlsx, .jpg, .jpeg, .png, .txt"
        aria-label="File upload"
      />
      <p className="text-sm">{fileUploadText}</p>
    </label>
  );
};

export default FileUploadLabel;
