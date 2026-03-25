import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateNoteSummary } from '../../store/Reducers/noteReducer';

// Three staggered bouncing dots for streaming states
const StreamingDots = ({ className = '' }) => (
    <span className={`inline-flex items-center gap-[3px] ${className}`}>
        {[0, 1, 2].map((i) => (
            <span
                key={i}
                className="w-1 h-1 rounded-full bg-current"
                style={{ animation: `bounce 1s ease-in-out ${i * 0.16}s infinite` }}
            />
        ))}
    </span>
);

// AISummary is controlled: parent owns open/collapsed state
// Props: noteId, open, onToggle
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

    if (!open && !hasSummary && !streaming) return null;

    return (
        <div className="mt-3">
            {/* Toggle strip */}
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls="ai-summary-body"
                className="flex items-center gap-1.5 w-full text-left py-0.5
                    text-caption font-medium
                    text-accent dark:text-yellow-400
                    hover:text-accent-hover dark:hover:text-yellow-300
                    transition-colors duration-150"
            >
                {/* Spark icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="currentColor" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
                    <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.683a1 1 0 0 1 .633.633l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684z" />
                </svg>
                <span>
                    {streaming && !streamingSummary ? 'Summarising' : 'AI Summary'}
                </span>
                {streaming && !streamingSummary && (
                    <StreamingDots className="opacity-70" />
                )}
                {/* Chevron */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="currentColor" aria-hidden="true"
                    className={`w-3 h-3 ml-auto shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Collapsible body — aria-live announces streamed tokens to screen readers */}
            {open && (
                <div
                    id="ai-summary-body"
                    role="region"
                    aria-label="AI Summary"
                    aria-live="polite"
                    aria-atomic="false"
                    className="mt-2 border-l-2 border-accent pl-3 py-2.5
                        bg-accent-subtle dark:bg-yellow-900/10 rounded-r-sm">

                    {streaming && !streamingSummary ? (
                        /* Waiting for first token */
                        <div className="flex items-center gap-2 text-caption
                            text-ink-secondary dark:text-ink-inverse-secondary">
                            <span className="italic">Generating summary</span>
                            <StreamingDots />
                        </div>

                    ) : streaming ? (
                        /* Tokens arriving */
                        <p className="text-small italic leading-relaxed m-0
                            text-ink-secondary dark:text-ink-inverse-secondary">
                            {displaySummary}
                            <span className="inline-block w-px h-3 bg-accent ml-0.5 opacity-75 animate-pulse" />
                        </p>

                    ) : (
                        /* Complete summary */
                        <div>
                            <p className="text-small italic leading-relaxed m-0
                                text-ink-secondary dark:text-ink-inverse-secondary">
                                {displaySummary}
                            </p>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); void handleSummarize(); }}
                                className="mt-2 inline-flex items-center gap-1 text-caption
                                    text-accent dark:text-yellow-400
                                    hover:text-accent-hover dark:hover:text-yellow-300
                                    transition-colors duration-150"
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3" aria-hidden="true">
                                    <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219z" clipRule="evenodd" />
                                </svg>
                                Regenerate
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AISummary;
