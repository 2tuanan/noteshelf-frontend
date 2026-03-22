import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../store/Reducers/themeReducer";

const DarkModeToggle = () => {
    const dispatch = useDispatch();
    const darkMode = useSelector(state => state.theme.darkMode);

    return (
        <button
            type="button"
            aria-label="Toggle dark mode"
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 rounded-full hover:bg-yellow-500/20 transition-colors text-white"
        >
            {darkMode ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                >
                    <path d="M12 4.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 12 4.75z" />
                    <path d="M12 18.5a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75z" />
                    <path d="M4.75 12a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 4.75 12z" />
                    <path d="M18.5 12a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75z" />
                    <path d="M6.47 6.47a.75.75 0 0 1 1.06 0l.35.35a.75.75 0 1 1-1.06 1.06l-.35-.35a.75.75 0 0 1 0-1.06z" />
                    <path d="M16.12 16.12a.75.75 0 0 1 1.06 0l.35.35a.75.75 0 1 1-1.06 1.06l-.35-.35a.75.75 0 0 1 0-1.06z" />
                    <path d="M6.47 17.53a.75.75 0 0 1 0-1.06l.35-.35a.75.75 0 1 1 1.06 1.06l-.35.35a.75.75 0 0 1-1.06 0z" />
                    <path d="M16.12 7.88a.75.75 0 0 1 0-1.06l.35-.35a.75.75 0 1 1 1.06 1.06l-.35.35a.75.75 0 0 1-1.06 0z" />
                    <path d="M12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5z" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                >
                    <path d="M21.75 15.5a8.24 8.24 0 0 1-10.7-10.7.75.75 0 0 0-1.02-.88A9.75 9.75 0 1 0 22.63 16.5a.75.75 0 0 0-.88-1.02z" />
                </svg>
            )}
        </button>
    );
};

export default DarkModeToggle;
