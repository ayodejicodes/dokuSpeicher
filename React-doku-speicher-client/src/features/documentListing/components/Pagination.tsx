import { PaginationProps } from "../types/DocumentListingTypes";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const handlePageChange = (direction: "next" | "prev") => {
    const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        aria-label="Go to previous page"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange("prev")}
        className="px-3 py-1 text-sm text-white rounded hover:bg-gray-300 disabled:opacity-50 bg-accentBlue"
      >
        Previous
      </button>
      <span className="text-sm text-gray">
        Page {currentPage} of {totalPages}
      </span>
      <button
        aria-label="Go to next page"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange("next")}
        className="px-3 py-1 text-sm text-white rounded hover:bg-gray-300 disabled:opacity-50 bg-accentBlue"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
