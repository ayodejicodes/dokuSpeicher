import { IoMdShareAlt } from "react-icons/io";
import { MdDownload } from "react-icons/md";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  downloadDocument,
  shareDocument,
} from "../../../redux/slices/documentSlice";
import { useDispatch } from "react-redux";
import useFormattedDate from "../../../hooks/useFormattedDate ";
import { bytesToKilobytes } from "../../../hooks/useBytesToKilobytes";
import { useState } from "react";

const DocumentDetails = () => {
  const currentDocument = useSelector(
    (state: RootState) => state.documents.currentDocument
  );
  const [daysUntilExpiry, setDaysUntilExpiry] = useState("");
  const [shareLink, setShareLink] = useState("");

  const fileType = currentDocument?.type ?? "unknown";
  const fileName = currentDocument?.name ?? "N/A";
  const fileSize = currentDocument?.fileSize ?? "N/A";
  const uploadDate = currentDocument?.uploadDateTime ?? "N/A";

  const downloadCount = currentDocument?.downloadCount ?? "N/A";

  let fileSizeConverted;

  if (fileSize !== "N/A") {
    fileSizeConverted = bytesToKilobytes(fileSize);
  }

  const dispatch = useDispatch<AppDispatch>();

  const handleDownload = () => {
    if (currentDocument) {
      const fileName = currentDocument.filePath.split("/").pop();

      if (fileName) {
        dispatch(downloadDocument(fileName)).catch((error: Error) => {
          console.error("Failed to download the document:", error.message);
        });
      }
    }
  };

  const handleShare = () => {
    if (currentDocument && daysUntilExpiry) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + Number(daysUntilExpiry));
      const formattedExpiryDate = expiryDate.toISOString();

      const requestData = {
        documentId: currentDocument.documentId,
        expiryDateTime: formattedExpiryDate,
      };

      dispatch(shareDocument(requestData))
        .then((action) => {
          if (shareDocument.fulfilled.match(action)) {
            const shareLink = action.payload.generatedLink;
            setShareLink(shareLink);
          }
        })
        .catch((error) => {
          console.error("Failed to share the document:", error.message);
        });
    } else {
      console.error("Expiry days are not set");
    }
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard
        .writeText(shareLink)
        .then(() => {
          console.log("Link copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy link: ", err);
        });
    }
  };

  return (
    <div className="bg-lightBackground/35 h-[45%] p-5 flex flex-col">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm text-accentBlue">File Name</p>
            <p className="text-xs break-all mt-1">{fileName}</p>
          </div>
          <div>
            <p className="text-sm text-accentBlue">Date Uploaded</p>
            <p className="text-xs break-all mt-1">
              {useFormattedDate(uploadDate)}
            </p>
          </div>
          <div></div>
        </div>

        <div className="w-28 h-28">
          <img src={`src/assets/${fileType}-icon.png`} alt="" />
        </div>
      </div>

      <div className="flex justify-between mt-3 mb-10">
        <div>
          <p className="text-sm text-accentBlue">Downloaded</p>
          <p className="text-xs break-all mt-1">{downloadCount} times</p>
        </div>
        <div>
          <p className="text-sm text-accentBlue mr-6">File Size</p>
          <p className="text-xs break-all mt-1">{fileSizeConverted} KB</p>
        </div>
      </div>
      {!shareLink && (
        <input
          type="number"
          placeholder="Expiry days must be set to share"
          value={daysUntilExpiry}
          onChange={(e) => setDaysUntilExpiry(e.target.value)}
          style={{ fontSize: "16px", backgroundColor: "#eff2fd" }}
        />
      )}
      {shareLink && (
        <div className="flex items-center space-x-2">
          <small className="text-xs break-all">{shareLink}</small>
          <button
            onClick={handleCopyLink}
            className="bg-accentBlue text-white px-2 py-1 rounded text-xs hover:bg-darkerBlue transition duration-300 ease-in-out cursor-pointer"
          >
            Copy Link
          </button>
        </div>
      )}
      <div className="flex gap-10 justify-center mt-5">
        <div className="flex flex-col items-center gap-2">
          <div
            className="bg-accentBlue text-darkGray text-white/80 w-8 h-8 flex items-center justify-center rounded-md 
                  hover:bg-darkerBlue transition duration-300 ease-in-out cursor-pointer"
            onClick={handleDownload}
          >
            <MdDownload size={22} />
          </div>
          <p className="text-xs">Download</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div
            className=" bg-accentBlue text-darkGray text-white/80 w-8 h-8 flex items-center justify-center rounded-md 
                  hover:bg-darkerBlue transition duration-300 ease-in-out cursor-pointer"
            onClick={handleShare}
          >
            <IoMdShareAlt size={22} />
          </div>
          <p className="text-xs">Share</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
