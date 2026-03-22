import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className='text-center w-full h-10 dark:bg-gray-900 transition-colors duration-200 dark:text-gray-300'>
            <p className='text-[#ccc] text-sm sm:text-base dark:text-gray-300'>Copyright ⓒ {currentYear}</p>
        </footer>
    );
};

export default Footer;