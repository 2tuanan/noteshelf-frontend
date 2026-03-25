import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        /*
         * Light: bg-surface-inset (one step darker than page bg) + top hairline
         * Dark:  bg-dark-raised (one step lighter than page bg) + top hairline
         * => footer feels grounded in both modes, never invisible or floating
         */
        <footer className="w-full
            bg-surface-inset dark:bg-dark-raised
            border-t border-border dark:border-dark-border
            transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3
                flex items-center justify-between gap-4">
                <span className="text-caption font-medium text-ink-tertiary dark:text-ink-inverse-tertiary"
                    style={{ fontFamily: 'McLaren, cursive' }}>
                    Noteshelf
                </span>
                <span className="text-caption text-ink-tertiary dark:text-ink-inverse-tertiary">
                    &copy; {currentYear}
                </span>
            </div>
        </footer>
    );
};

export default Footer;