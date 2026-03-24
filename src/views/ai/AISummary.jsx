import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateNoteSummary } from '../../store/Reducers/noteReducer';

// AISummary is controlled: parent owns open/collapsed state
// Props:
//   noteId    — string
//   open      — boolean (controlled by Note.jsx)
//   onToggle  — () => void
const AISummary = ({ noteId, open, onToggle }) => {
    const dispatch = useDispatch();
    const [streamingSummary, setStreamingSummary] = useState('');
    const [streaming, setStreaming] = useState(false);

    const note = useSelector((state) =>
        state.note.notes.find((n) => n._id === noteId)
    );
    const savedSummary = note?.summary || '';
    const displaySummary = streaming ? streamingSummary : savedSummary;
    const hasSummary = Boolean(displaySummary);

    const handleSummarize = async () => {
        setStreamingSummary('');
        setStreaming(true);
        let fullSummary = '';
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL ||
                    'http://localhost:4088/api'}/ai/summarize/${noteId}`,
                { method: 'POST', credentials: 'include' }
            );
            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value);
                const lines = text.split('\n').filter((l) => l.startsWith('data: '));
                for (const line of lines) {
                    const payload = JSON.parse(line.slice(6));
                    if (payload.token) {
                        fullSummary += payload.token;
                        setStreamingSummary(fullSummary);
                    }
                    if (payload.done) {
                        dispatch(updateNoteSummary({ id: noteId, summary: fullSummary }));
                        setStreaming(false);
                    }
                    if (payload.error) {
                        setStreaming(false);
                    }
                }
            }
        } catch (err) {
            console.error('Summarize failed:', err);
        } finally {
            setStreaming(false);
        }
    };

    // Automatically start summarizing when opened and no summary exists yet
    useEffect(() => {
        if (open && !hasSummary && !streaming) {
            void handleSummarize();
        }
    }, [open, hasSummary, streaming]);

    // Nothing to show when closed and idle with no summary
    if (!open && !hasSummary && !streaming) return null;

    return (
        <div className="mt-2">
            {/* Toggle strip */}
            <button
                type="button"
                onClick={onToggle}
                className="flex items-center gap-1 w-full text-left
                    text-caption font-medium
                    text-accent dark:text-yellow-400
                    hover:text-accent-hover dark:hover:text-yellow-300
                    transition-colors duration-150"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                    <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.683a1 1 0 0 1 .633.633l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684z" />
                </svg>
                <span>{open ? 'Hide summary' : 'Show summary'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-3 h-3 ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Collapsible body */}
            {open && (
                <div className="mt-2">
                    {streaming && !streamingSummary ? (
                        <p className="text-caption text-ink-tertiary dark:text-ink-inverse-tertiary
                            italic animate-pulse">Summarizing…</p>
                    ) : (
                        <p className="text-small italic leading-relaxed
                            text-ink-secondary dark:text-ink-inverse-secondary
                            border-l-2 border-accent pl-2">
                            {displaySummary}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AISummary;
