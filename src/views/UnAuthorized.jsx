import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UnAuthorized = () => {
    const navigate = useNavigate();

    // Standalone public route — no MainLayout/Redux.
    // Mirror OS dark preference, same pattern as SharedNote.
    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
    }, []);

    return (
        <div className="min-h-screen bg-surface dark:bg-dark
            font-montserrat flex items-center justify-center px-4
            transition-colors duration-200">

            <div className="text-center max-w-sm w-full space-y-6">

                {/* Icon */}
                <span className="inline-flex items-center justify-center
                    w-16 h-16 rounded-panel
                    bg-accent-subtle text-accent mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor" className="w-8 h-8" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1zm3 8V5.5a3 3 0 1 0-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                </span>

                {/* Heading */}
                <div className="space-y-2">
                    <p className="text-caption font-medium text-ink-tertiary dark:text-ink-inverse-tertiary
                        uppercase tracking-widest">
                        403
                    </p>
                    <h1 className="text-heading font-semibold
                        text-ink dark:text-ink-inverse">
                        Access denied
                    </h1>
                    <p className="text-body text-ink-secondary dark:text-ink-inverse-secondary">
                        You don&rsquo;t have permission to view this page.
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
                        onClick={() => navigate('/login')}
                        className="inline-flex items-center
                            px-btn-x py-btn-y
                            bg-accent hover:bg-accent-hover active:scale-95
                            text-accent-fg text-small font-semibold
                            rounded-button shadow-sm
                            transition-all duration-150"
                    >
                        Log in
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

export default UnAuthorized;