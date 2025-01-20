import React from "react";

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchQuery,
    setSearchQuery,
}) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder="Search Chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border rounded"
            />
        </div>
    );
};

export default SearchBar;
