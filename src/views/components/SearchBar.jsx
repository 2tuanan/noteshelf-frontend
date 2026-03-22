import React, { useEffect, useState } from 'react';

const SearchBar = ({ onSearch, onClear }) => {
    const [value, setValue] = useState('');

    useEffect(() => {
        const trimmed = value.trim();
        if (!trimmed) {
            onClear();
            return undefined;
        }
        const timer = setTimeout(() => onSearch(trimmed), 300);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <input
            type="text"
            placeholder="Search notes..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
        />
    );
};

export default SearchBar;
