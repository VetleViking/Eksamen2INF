import React from "react";

type SearchProps = {
    search: string;
    setSearch: (search: string) => void;
};

const Search = ({ search, setSearch }: SearchProps) => {    
    return (
        <input
            className="mx-1 p-2 border border-black text-xl rounded-sm"
            type="text"
            placeholder="Søk..."
            value={search}

            onChange={(e) => {
                setSearch(e.target.value);
            }}
        />
    );
};

export default Search;