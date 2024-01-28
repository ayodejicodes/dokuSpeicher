import React, { useCallback, useEffect, useMemo, useState } from "react";
import DocumentRow from "./DocumentRow";
import Pagination from "./Pagination";
import { FileType } from "../types/DocumentListingTypes";
import SearchAndSortUI from "./SearchAndSortUI";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  Document,
  getDocuments,
  selectDocument,
  toggleSelectAllDocuments,
} from "../../../redux/slices/documentSlice";
import documentService from "../../documentManagement/services/documentService";

const DocumentTable: React.FC<{ onRowClick: (documentId: string) => void }> = ({
  onRowClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedDocuments, setFetchedDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<string | null>(null);
  const documentsPerPage = 3;

  const dispatch = useDispatch<AppDispatch>();
  const selectedDocuments = useSelector(
    (state: RootState) => state.documents.selectedDocuments
  );
  const { isLoading, isError, message } = useSelector(
    (state: RootState) => state.documents
  );
  const shouldUpdateDocuments = useSelector(
    (state: RootState) => state.documents.shouldUpdateDocuments
  );

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await dispatch(getDocuments());
      setFetchedDocuments(res.payload.data);
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, shouldUpdateDocuments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredAndSortedDocuments = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();

    const sortedDocuments = [...fetchedDocuments].sort(
      (a, b) =>
        new Date(b.uploadDateTime).getTime() -
        new Date(a.uploadDateTime).getTime()
    );

    return sortedDocuments.filter((doc) => {
      const nameMatch = doc.name.toLowerCase().includes(searchTermLower);
      const typeMatch = sortType
        ? doc.type.toLowerCase() === sortType.toLowerCase()
        : true;
      return nameMatch && typeMatch;
    });
  }, [searchTerm, sortType, fetchedDocuments]);

  const currentDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * documentsPerPage;
    const endIndex = startIndex + documentsPerPage;
    return filteredAndSortedDocuments.slice(startIndex, endIndex);
  }, [filteredAndSortedDocuments, currentPage, documentsPerPage]);

  const isAllSelected = useMemo(() => {
    return currentDocuments.every((doc) => selectedDocuments[doc.documentId]);
  }, [currentDocuments, selectedDocuments]);

  const handleSort = (fileType: string | null) => {
    setSortType((prevSortType) =>
      prevSortType === fileType ? null : fileType
    );
  };

  const toggleDocumentSelection = useCallback(
    (documentId: string) => {
      dispatch(
        selectDocument({
          documentId,
          isSelected: !selectedDocuments[documentId],
        })
      );
    },
    [dispatch, selectedDocuments]
  );

  const toggleSelectAll = () => {
    dispatch(toggleSelectAllDocuments(!isAllSelected));
  };

  const handleDownloadSelected = async () => {
    const selectedBlobNames = Object.entries(selectedDocuments)
      .filter(([, isSelected]) => isSelected)
      .map(([documentId]) => {
        const document = fetchedDocuments.find(
          (doc) => doc.documentId === documentId
        );
        return document ? document.filePath.split("/").pop() : null;
      })
      .filter((blobName): blobName is string => blobName !== null);

    if (selectedBlobNames.length > 0) {
      try {
        await documentService.downloadMultipleDocuments(selectedBlobNames);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const isAnyDocumentSelected = useMemo(() => {
    return Object.values(selectedDocuments).some((isSelected) => isSelected);
  }, [selectedDocuments]);

  const MemoizedDocumentRow = React.memo(DocumentRow);

  return (
    <div className="overflow-auto">
      <SearchAndSortUI
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortType={sortType}
        handleSort={handleSort}
        FileType={FileType}
      />
      {isAnyDocumentSelected && (
        <button
          className="bg-accentBlue text-white pt-1 pb-1 pl-2 pr-2 m-2 rounded-lg"
          onClick={handleDownloadSelected}
        >
          Download Selected
        </button>
      )}
      {isLoading && <div>Loading documents...</div>}
      {isError && <div>Error fetching documents: {message}</div>}
      {!isLoading && !isError && (
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded mt-3">
          <thead className="bg-gray-50">
            <tr className="border-gray/40 border-b-[3px]">
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider"
              >
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider"
              >
                File name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider"
              >
                Date/Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider"
              >
                File Size
              </th>
            </tr>
          </thead>
          <tbody>
            {currentDocuments.map((document) => (
              <MemoizedDocumentRow
                key={document.documentId}
                document={document}
                isSelected={selectedDocuments[document.documentId]}
                onSelectionChange={toggleDocumentSelection}
                onClick={() => onRowClick(document.documentId)}
              />
            ))}
          </tbody>
        </table>
      )}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={Math.ceil(
          filteredAndSortedDocuments.length / documentsPerPage
        )}
      />
    </div>
  );
};

export default DocumentTable;
