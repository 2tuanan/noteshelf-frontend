import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
    const darkMode = useSelector(state => state.theme.darkMode);

    return (
        <div className={`flex flex-col min-h-screen bg-surface dark:bg-dark transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
            <Header />
            <main className='flex-grow bg-surface dark:bg-dark transition-colors duration-200'>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;