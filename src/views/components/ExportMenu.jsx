import { useEffect, useRef, useState } from 'react';

const ExportMenu = ({ noteId }) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    const menuRef = useRef(null);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (!open) return undefined;
        const focusTimer = requestAnimationFrame(() => {
            const firstItem = menuRef.current?.querySelector('button');
            firstItem?.focus();
        });
        return () => cancelAnimationFrame(focusTimer);
    }, [open]);

    // Programmatic download — avoids anchor-tag Firefox quirks
    const triggerDownload = (format) => {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4088/api';
        const url = `${baseUrl}/export/${noteId}?format=${format}`;
        fetch(url, { credentials: 'include' })
            .then((res) => res.blob())
            .then((blob) => {
                const objectUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = objectUrl;
                a.download = format === 'pdf'
                    ? `note-${noteId}.pdf`
                    : `note-${noteId}.md`;
                a.click();
                URL.revokeObjectURL(objectUrl);
            })
            .catch((err) => console.error('Export failed:', err));
        setOpen(false);
    };

    const handleMenuKeyDown = (e) => {
        const items = Array.from(menuRef.current?.querySelectorAll('button') || []);
        if (items.length === 0) return;

        const currentIndex = items.indexOf(document.activeElement);

        if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
            triggerRef.current?.focus();
            return;
        }

        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

        e.preventDefault();
        const nextIndex = e.key === 'ArrowDown'
            ? (currentIndex + 1) % items.length
            : (currentIndex - 1 + items.length) % items.length;
        items[nextIndex]?.focus();
    };

    return (
        <div className="relative" ref={ref}>
            {/* Trigger — matches IconBtn in Note.jsx */}
            <button
                type="button"
                ref={triggerRef}
                aria-label="Export note"
                aria-expanded={open}
                aria-haspopup="menu"
                onClick={() => setOpen((v) => !v)}
                className={`flex items-center justify-center w-7 h-7 rounded-button
                    text-ink-secondary dark:text-ink-inverse-secondary
                    hover:bg-surface-inset dark:hover:bg-dark-inset
                    hover:text-ink dark:hover:text-ink-inverse
                    transition-colors duration-150
                    ${open ? 'bg-surface-inset dark:bg-dark-inset' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="currentColor" className="w-4 h-4" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 2.5a.75.75 0 0 1 .75.75v8.69l1.97-1.97a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L6.22 11.03a.75.75 0 1 1 1.06-1.06l1.97 1.97V3.25A.75.75 0 0 1 10 2.5zM3 15.75a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    role="menu"
                    aria-label="Export options"
                    ref={menuRef}
                    onKeyDown={handleMenuKeyDown}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20
                        w-36 py-1
                        bg-surface-raised dark:bg-dark-raised
                        border border-border dark:border-dark-border
                        rounded-panel shadow-elevated dark:shadow-elevated-dark">
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => triggerDownload('pdf')}
                        className="flex items-center gap-2 w-full px-3 py-2
                            text-small text-ink dark:text-ink-inverse
                            hover:bg-surface-inset dark:hover:bg-dark-inset
                            transition-colors duration-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor" className="w-4 h-4 text-ink-tertiary dark:text-ink-inverse-tertiary shrink-0" aria-hidden="true">
                            <path fillRule="evenodd" d="M4 4a2 2 0 0 1 2-2h4.586A2 2 0 0 1 12 2.586L15.414 6A2 2 0 0 1 16 7.414V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4zm2 6a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1zm1 3a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2H7z" clipRule="evenodd" />
                        </svg>
                        Export as PDF
                    </button>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => triggerDownload('md')}
                        className="flex items-center gap-2 w-full px-3 py-2
                            text-small text-ink dark:text-ink-inverse
                            hover:bg-surface-inset dark:hover:bg-dark-inset
                            transition-colors duration-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor" className="w-4 h-4 text-ink-tertiary dark:text-ink-inverse-tertiary shrink-0" aria-hidden="true">
                            <path fillRule="evenodd" d="M4 4a2 2 0 0 1 2-2h4.586A2 2 0 0 1 12 2.586L15.414 6A2 2 0 0 1 16 7.414V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4zm2 5a1 1 0 0 1 1-1h1v2l2-2 2 2V8h1a1 1 0 1 1 0 2h-1v3a1 1 0 0 1-1.707.707L10 12.414l-1.293 1.293A1 1 0 0 1 7 13V10H6a1 1 0 0 1-1-1z" clipRule="evenodd" />
                        </svg>
                        Markdown
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExportMenu;
