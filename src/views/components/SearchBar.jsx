import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearSearch, search_notes } from '../../store/Reducers/noteReducer';

// Self-contained — dispatches search/clear to Redux directly.
// No onSearch/onClear props needed.
const SearchBar = () => {
    const dispatch = useDispatch();
    const [value, setValue] = useState('');

    useEffect(() => {
        const trimmed = value.trim();
        if (!trimmed) {
            dispatch(clearSearch());
            return undefined;
        }
        const timer = setTimeout(() => dispatch(search_notes(trimmed)), 300);
        return () => clearTimeout(timer);
    }, [value, dispatch]);

    return (
        <div className="relative w-full">
            {/* Search icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                    text-ink-tertiary dark:text-ink-inverse-tertiary pointer-events-none"
            >
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9z" clipRule="evenodd" />
            </svg>

            <input
                type="text"
                placeholder="Search notes…"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full pl-9 pr-8 py-2
                    bg-surface-inset dark:bg-dark-inset
                    border border-black/15 dark:border-dark-border
                    rounded-input
                    text-body text-ink dark:text-ink-inverse
                    placeholder:text-ink-tertiary dark:placeholder:text-ink-inverse-tertiary
                    outline-none focus:ring-2 focus:ring-black/25 dark:focus:ring-accent/40
                    transition-colors duration-150"
            />

            {/* Clear button — shown when there is a value */}
            {value && (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setValue('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2
                        flex items-center justify-center w-4 h-4
                        text-ink-tertiary dark:text-ink-inverse-tertiary
                        hover:text-ink dark:hover:text-ink-inverse
                        transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;
