import React from "react";

type SearchProps = {
    search: string;
    setSearch: (search: string) => void;
};

const Search = ({ search, setSearch }: SearchProps) => {    
    return (
        <input
            className="mx-1 p-1 border border-black"
            type="text"
            placeholder="Search..."
            value={search}

            onChange={(e) => {
                setSearch(e.target.value);
            }}
        />
    );
};

export default Search;