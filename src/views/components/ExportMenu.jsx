import { useEffect, useRef, useState } from 'react';

const ExportMenu = ({ noteId }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handler = (event) => {
            if (!ref.current?.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const triggerDownload = (format) => {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4088/api';
        const link = document.createElement('a');
        link.href = `${baseUrl}/export/${noteId}?format=${format}`;
        link.click();
        setOpen(false);
    };

    return (
        <div className='relative' ref={ref}>
            <button
                onClick={() => setOpen((value) => !value)}
                className='text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
            >
                ↓ Export
            </button>
            {open && (
                <div className='absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-10'>
                    <button
                        onClick={() => triggerDownload('pdf')}
                        className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
                    >
                        📄 PDF
                    </button>
                    <button
                        onClick={() => triggerDownload('md')}
                        className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
                    >
                        📝 Markdown
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExportMenu;
