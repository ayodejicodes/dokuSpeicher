import React, { useRef, useState } from "react";
import DocumentTable from "../features/documentListing/components/DocumentTable";
import FileUploadLabel from "../features/documentManagement/components/FileUploadLabel";
import CategoryDisplay from "../features/category/components/CategoryDisplay";
import DocumentDetails from "../features/documentOverview/components/DocumentDetails";
import DocumentPreview from "../features/documentOverview/components/DocumentPreview";
import Copyright from "../components/common/Copyright";
import {
  BsFiletypeDocx,
  BsFiletypeJpg,
  BsFiletypePdf,
  BsFiletypeTxt,
  BsFiletypeXlsx,
} from "react-icons/bs";
import {
  Document,
  createDocument,
  getDocument,
  triggerDocumentUpdate,
} from "../redux/slices/documentSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import { useSelector } from "react-redux";
import useCalculateTotalSizeByType from "../hooks/useCalculateTotalSizeByType ";
import useCountFilesByType from "../hooks/useCountFilesByType";
import CustomPieChart from "../features/documentOverview/components/CustomPieChart";
import RecentActivities from "../features/documentOverview/components/RecentActivities";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  const [showDocumentDetails, setShowDocumentDetails] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isError } = useSelector(
    (state: RootState) => state.documents
  );
  const currentDocument = useSelector(
    (state: RootState) => state.documents.currentDocument
  );
  const documents = useSelector(
    (state: RootState) => state.documents.documents
  );

  const fileCounts = useCountFilesByType(documents);
  const categories = [
    {
      type: "PDF",
      count: fileCounts["pdf"] || 0,
      Icon: BsFiletypePdf,
      fliesTotalSize: useCalculateTotalSizeByType(documents, "pdf"),
    },
    {
      type: "Excel",
      count: fileCounts["xlsx"] || 0,
      Icon: BsFiletypeXlsx,
      fliesTotalSize: useCalculateTotalSizeByType(documents, "xlsx"),
    },
    {
      type: "Word",
      count: fileCounts["docx"] || 0,
      Icon: BsFiletypeDocx,
      fliesTotalSize: useCalculateTotalSizeByType(documents, "docx"),
    },
    {
      type: "TXT",
      count: fileCounts["txt"] || 0,
      Icon: BsFiletypeTxt,
      fliesTotalSize: useCalculateTotalSizeByType(documents, "txt"),
    },
    {
      type: "Images",
      count:
        (fileCounts["jpg"] || 0) +
        (fileCounts["png"] || 0) +
        (fileCounts["jpeg"] || 0),
      Icon: BsFiletypeJpg,
      fliesTotalSize:
        useCalculateTotalSizeByType(documents, "jpg") +
        useCalculateTotalSizeByType(documents, "png") +
        useCalculateTotalSizeByType(documents, "jpeg"),
    },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files)
        .map((file) => file.name)
        .join(", ");
      setSelectedFiles(fileNames);
    }
  };

  const handleCancel = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSelectedFiles("");
  };

  const sanitizeFilename = (filename: string) => {
    return filename.replace(/[^a-z0-9_.-]/gi, "_");
  };

  const handleUpload = () => {
    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      const formData = new FormData();

      for (let i = 0; i < fileInputRef.current.files.length; i++) {
        const file = fileInputRef.current.files[i];

        const sanitizedFilename = sanitizeFilename(file.name);

        formData.append("files", file, sanitizedFilename);
      }

      dispatch(createDocument(formData))
        .unwrap()
        .then((response) => {
          console.log("Upload successful:", response);
          setSelectedFiles("");
          dispatch(triggerDocumentUpdate());
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        })
        .catch((error) => {
          console.error("Upload failed:", error);
        });
    } else {
      console.error("No files selected");
    }
  };

  const fileUploadText = selectedFiles ? selectedFiles : "Click to upload";

  const handleRowClick = (documentId: string) => {
    dispatch(getDocument(documentId)).then((action) => {
      if (getDocument.fulfilled.match(action)) {
        setSelectedDocument(action.payload.data);
        setShowDocumentDetails(true);
      } else {
        setSelectedDocument(null);
      }
    });
  };

  const handleClose = () => {
    setShowDocumentDetails(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full flex h-full overflow-x-hidden gap-3 text-darkGray">
      <div className="flex  items-center  flex-col basis-[15%] bg-lightBackground h-full p-5">
        <img
          src="assets/avatar.jpg"
          alt=""
          className="flex w-24 h-24 rounded-full bg-red-200 mt-16"
        />
        <h1 className="mt-4 font-semibold">Welcome, Francis</h1>
        <button
          onClick={handleLogout}
          className="mt-4 bg-accentRed text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col flex-grow basis-[65%] bg-lightBackground h-full  overflow-hidden">
        <div className="h-[45%] p-5 flex flex-col gap-2">
          <h1 className="font-semibold text-2xl text-accentBlue">Dashboard</h1>
          <small className="mb-4 text-gray">
            Upload, download and manage all your Documents with ease.
          </small>
          <div className="h-full">
            <FileUploadLabel
              selectedFiles={selectedFiles}
              handleFileChange={handleFileChange}
              fileUploadText={fileUploadText}
              fileInputRef={fileInputRef}
            />
            {selectedFiles && (
              <div className="flex gap-2 mt-3 ">
                {isError && <p>Error Uploading Document(s)</p>}
                {isLoading ? (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden bg-lightBlue">
                    <p>Uploading</p>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-center w-full">
                    <button
                      className="bg-accentBlue rounded pt-1 pb-1 pl-2 pr-2 text-white text-sm"
                      onClick={handleUpload}
                    >
                      Upload
                    </button>
                    <button
                      className="bg-accentRed rounded pt-1 pb-1 pl-2 pr-2 text-white text-sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <CategoryDisplay categories={categories} />
        </div>
        <div className="h-[55%] w-full p-5">
          <DocumentTable onRowClick={handleRowClick} />
        </div>
      </div>
      <div className="flex flex-col flex-shrink-0 flex-grow-0 basis-[25%] bg-white h-full w-full">
        {showDocumentDetails && currentDocument ? (
          <>
            <DocumentPreview
              fileType={selectedDocument?.type ?? "unknown"}
              fileUrl={selectedDocument?.filePath ?? ""}
              handleClose={handleClose}
            />

            <DocumentDetails />
          </>
        ) : (
          <>
            <div className="bg-lightBackground h-[45%] p-5">
              <div>
                <p className="text-base font-semibold text-accentBlue">
                  Data Storage
                </p>
                <div className="w-full flex flex-col items-center gap-5 mt-5">
                  <CustomPieChart />
                </div>
              </div>
            </div>
            <RecentActivities />
          </>
        )}
        <Copyright />
      </div>
    </div>
  );
};

export default Dashboard;
