import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
    const { pathname } = useLocation();

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
            {pathname !== '/user' && <Footer />}
        </div>
    );
};

export default MainLayout;