import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/Reducers/authReducer';
import { useLocation, useNavigate } from 'react-router-dom';
import DarkModeToggle from '../views/components/DarkModeToggle';
import SearchBar from '../views/components/SearchBar';

const Header = () => {
    const url = process.env.REACT_APP_FRONTEND_DOMAIN;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const { userInfo, role } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const showSearch = pathname === '/user';

    // Close dropdown when clicking outside the user section
    useEffect(() => {
        const handler = (e) => {
            if (!dropdownRef.current?.contains(e.target)) setIsDropdownOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <header className="sticky top-0 z-30
            bg-accent dark:bg-dark-raised
            border-b border-black/10 dark:border-dark-border
            shadow-card dark:shadow-card-dark
            transition-colors duration-200">

            <div className="min-h-header flex flex-wrap items-center gap-3 sm:gap-5 px-4 sm:px-6 py-2 sm:py-0">

                {/* ── Brand — left ── */}
                <div className="flex items-center gap-2 shrink-0 select-none">
                    <img
                        src={`${process.env.PUBLIC_URL}/logo512.png`}
                        alt="Noteshelf logo"
                        className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 object-contain"
                    />
                    <span className="font-mclaren text-xl sm:text-2xl leading-none
                        text-accent-fg dark:text-accent">
                        Noteshelf
                    </span>
                </div>

                {/* ── Search — stretches to fill center space ── */}
                <div className="order-3 w-full sm:order-none sm:flex-1 sm:min-w-0 sm:max-w-md sm:mx-auto">
                    {showSearch && <SearchBar />}
                </div>

                {/* ── Right: DarkModeToggle + user menu ── */}
                <div className="ml-auto flex items-center gap-1 shrink-0 relative" ref={dropdownRef}>

                    <DarkModeToggle />

                    {/* User button */}
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen((v) => !v)}
                        className="flex items-center gap-2 rounded-button px-2 py-1.5
                            text-accent-fg dark:text-ink-inverse
                            hover:bg-black/10 dark:hover:bg-white/10
                            transition-colors duration-150"
                    >
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-black/20 dark:bg-white/10
                            flex items-center justify-center overflow-hidden shrink-0">
                            <img
                                src={`${url}/images/admin.png`}
                                alt={userInfo.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        </div>

                        {/* Name + role — hidden on mobile */}
                        <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
                            <span className="text-small font-semibold">{userInfo.name}</span>
                            <span className="text-caption opacity-70">
                                {userInfo?.role?.charAt(0).toUpperCase() + userInfo?.role?.slice(1)}
                            </span>
                        </div>

                        {/* Chevron */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor"
                            className={`w-3.5 h-3.5 opacity-60 hidden sm:block transition-transform duration-150
                                ${isDropdownOpen ? 'rotate-180' : ''}`}>
                            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* Dropdown menu — positioned relative to this container */}
                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 z-50
                            w-48 py-1
                            bg-surface-raised dark:bg-dark-raised
                            border border-border dark:border-dark-border
                            rounded-card shadow-elevated dark:shadow-elevated-dark">
                            <button
                                type="button"
                                onClick={() => dispatch(logout({ navigate, role }))}
                                className="flex items-center gap-2 w-full px-4 py-2.5
                                    text-small text-ink dark:text-ink-inverse
                                    hover:bg-red-50 dark:hover:bg-red-900/20
                                    hover:text-danger dark:hover:text-red-400
                                    transition-colors duration-150"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                    className="w-4 h-4 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                </svg>
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;