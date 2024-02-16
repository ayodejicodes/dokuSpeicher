import React from "react";
import { IoMdSearch } from "react-icons/io";
import { FileType } from "../types/DocumentListingTypes";

interface SearchAndSortUIProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  sortType: string | null;
  handleSort: (fileType: string) => void;
  FileType: typeof FileType;
}

const SearchAndSortUI: React.FC<SearchAndSortUIProps> = ({
  searchTerm,
  setSearchTerm,
  sortType,
  handleSort,
  FileType,
}) => {
  return (
    <div className="flex justify-between items-center w-full">
      {/* Search input */}
      <div className="flex items-center relative">
        <input
          type="text"
          aria-label="Search documents"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:shadow-outline-blue sm:text-sm"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IoMdSearch size={20} />
        </div>
      </div>

      {/* Sorting buttons */}
      <div className="flex flex-wrap items-center justify-end rounded bg-white">
        {Object.values(FileType).map((value) => (
          <button
            key={value}
            onClick={() => handleSort(value)}
            className={`px-3 py-1 m-1 text-sm font-medium rounded ${
              sortType === value
                ? "bg-accentBlue text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndSortUI;
