import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
    const darkMode = useSelector((state) => state.theme.darkMode);
    const { pathname } = useLocation();

    // Tailwind dark: variants require an ANCESTOR to carry `.dark`.
    // Applying it to the root <div> means that div's own dark: classes
    // never fire (an element can't be its own ancestor in CSS).
    // Applying to <html> fixes this for every descendant, including the root div.
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className="flex flex-col min-h-screen bg-surface dark:bg-dark transition-colors duration-200">
            <Header />
            {/*
             * pt-header compensates for the sticky header (h-header = 64px).
             * NO inner max-width wrapper — each page owns its own content width.
             */}
            <main className="flex-1">
                <Outlet />
            </main>
            {/* Canvas/board pages are infinite — no footer disrupting the flow */}
            {pathname !== '/user' && <Footer />}
        </div>
    );
};

export default MainLayout;