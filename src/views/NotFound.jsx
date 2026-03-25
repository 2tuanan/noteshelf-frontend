import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-surface dark:bg-dark
            font-montserrat flex items-center justify-center px-4
            transition-colors duration-200">

            <div className="text-center max-w-sm w-full space-y-6">

                {/* Amber glow numeral */}
                <div aria-hidden="true"
                    className="text-[6rem] font-bold leading-none select-none
                        text-accent/20 dark:text-accent/15"
                    style={{ fontFamily: 'McLaren, cursive' }}>
                    404
                </div>

                {/* Messaging */}
                <div className="space-y-2">
                    <h1 className="text-heading font-semibold
                        text-ink dark:text-ink-inverse">
                        Page not found
                    </h1>
                    <p className="text-body text-ink-secondary dark:text-ink-inverse-secondary">
                        The page you&rsquo;re looking for doesn&rsquo;t exist
                        or may have been moved.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5
                            px-btn-x py-btn-y
                            border border-border dark:border-dark-border
                            bg-transparent hover:bg-surface-inset dark:hover:bg-dark-inset
                            text-ink-secondary dark:text-ink-inverse-secondary
                            text-small font-medium rounded-button
                            transition-colors duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10z" clipRule="evenodd" />
                        </svg>
                        Go back
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-1.5
                            px-btn-x py-btn-y
                            bg-accent hover:bg-accent-hover active:scale-95
                            text-accent-fg text-small font-semibold
                            rounded-button shadow-sm
                            transition-all duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                            <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7z" clipRule="evenodd" />
                        </svg>
                        Go home
                    </button>
                </div>

                {/* Subtle branding */}
                <p className="text-caption text-ink-tertiary dark:text-ink-inverse-tertiary"
                    style={{ fontFamily: 'McLaren, cursive' }}>
                    Noteshelf
                </p>
            </div>
        </div>
    );
};

export default NotFound;
