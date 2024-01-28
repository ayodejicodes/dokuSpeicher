import React from "react";
import { DocumentRowProps, FileType } from "../types/DocumentListingTypes";
import { bytesToKilobytes } from "../../../hooks/useBytesToKilobytes";
import { useGetFileIcon } from "../../../hooks/useGetFileIcon";
import useFormattedDateTime from "../../../hooks/useFormattedDate ";

const DocumentRow: React.FC<DocumentRowProps> = ({
  document,
  isSelected,
  onSelectionChange,
  onClick,
}) => {
  const { name, type, documentId, uploadDateTime, fileSize } = document;
  const fileIcon = useGetFileIcon(type as FileType);
  const formattedUploadDateTime = useFormattedDateTime(uploadDateTime);
  const formattedFileSize = `${bytesToKilobytes(fileSize)} KB`;

  return (
    <tr
      className={`${
        isSelected ? "bg-accentBlue/15" : ""
      } border-t-[1px] border-gray/40 cursor-pointer`}
      onClick={() => onClick(documentId)}
      role="row"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectionChange(documentId)}
          className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
          aria-label={`Select ${name}`}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap flex items-center">
        <span className="mr-2 w-6 h-6">{fileIcon}</span>
        <span className="text-sm font-medium text-gray-900 break-words whitespace-normal">
          {name}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{formattedUploadDateTime}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{formattedFileSize}</div>
      </td>
    </tr>
  );
};

export default DocumentRow;
