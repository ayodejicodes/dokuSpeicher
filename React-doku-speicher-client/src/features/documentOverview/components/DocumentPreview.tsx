import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import mammoth from "mammoth";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocumentPreview = ({
  fileType,
  fileUrl,
  handleClose,
}: {
  fileType: string;
  fileUrl: string;
  handleClose: () => void;
}) => {
  const [content, setContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (fileType === "txt") {
      fetch(fileUrl)
        .then((res) => res.text())
        .then((text) =>
          setContent(
            <div className="overflow-auto w-full h-full">
              <pre>{text}</pre>
            </div>
          )
        )
        .catch((error) => {
          console.error("Error fetching text file:", error);
          setContent(<p>Error loading content.</p>);
        });
    } else if (fileType === "xlsx") {
      fetch(fileUrl)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          const workbook = XLSX.read(buffer, { type: "buffer" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const htmlString = XLSX.utils.sheet_to_html(worksheet);
          setContent(<div dangerouslySetInnerHTML={{ __html: htmlString }} />);
        })
        .catch((error) => {
          console.error("Error:", error);
          setContent(<p>Error loading Excel file.</p>);
        });
    } else if (fileType === "docx") {
      fetch(fileUrl)
        .then((response) => response.blob())
        .then((blob) => blob.arrayBuffer())
        .then((arrayBuffer) => mammoth.convertToHtml({ arrayBuffer }))
        .then((result) =>
          setContent(<div dangerouslySetInnerHTML={{ __html: result.value }} />)
        )
        .catch((error) =>
          setContent(<p>Error loading document. {error.toString()}</p>)
        );
    }
  }, [fileType, fileUrl]);

  useEffect(() => {
    switch (fileType) {
      case "pdf":
        setContent(
          <Document
            file={fileUrl}
            onLoadError={(error) =>
              console.error("Error while loading document:", error)
            }
          >
            <Page pageNumber={1} />
          </Document>
        );
        break;

        break;
      case "png":
      case "jpg":
      case "jpeg":
        setContent(
          <img
            src={fileUrl}
            alt="Document Preview"
            className="max-w-full max-h-full object-contain"
          />
        );
        break;
      default:
        setContent(<p>Unsupported file type</p>);
    }
  }, [fileType, fileUrl]);

  return (
    <div className="bg-lightBackground h-[45%] p-5">
      <div className="flex justify-between items-center">
        <p className="text-base font-semibold text-accentBlue">Preview</p>

        <div
          className="bg-accentRed text-white p-2 m-2 rounded w-5 h-5 flex justify-center items-center cursor-pointer"
          onClick={handleClose}
        >
          x
        </div>
      </div>
      <div
        className={`w-[21rem] h-[90%] mt-2 items-center bg-white overflow-auto ${
          fileType !== "pdf" &&
          fileType !== "xlsx" &&
          fileType !== "txt" &&
          fileType !== "docx"
            ? "flex justify-center"
            : ""
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default DocumentPreview;
