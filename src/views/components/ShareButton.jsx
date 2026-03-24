import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../api/api';
import { updateNoteShareState } from '../../store/Reducers/noteReducer';

// ShareButton renders as a compact icon button in the Note toolbar.
// When clicked it expands a small popover with share / copy / unshare actions.
const ShareButton = ({ noteId, isPublic, shareToken }) => {
    const dispatch = useDispatch();
    const [open, setOpen]     = useState(false);
    const [copied, setCopied] = useState(false);
    const ref = useRef(null);

    // Close popover on outside click
    useEffect(() => {
        const handler = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const buildPublicLink = (token) => `${window.location.origin}/s/${token}`;

    const copyLink = async (token) => {
        const link = buildPublicLink(token);
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(link);
        } else {
            window.prompt('Copy this public note link', link);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        try {
            const { data } = await api.post(`/share-note/${noteId}`, {}, { withCredentials: true });
            await copyLink(data.shareToken);
            dispatch(updateNoteShareState({ noteId, isPublic: true, shareToken: data.shareToken }));
        } catch (e) {
            console.error('[share] failed:', e);
        }
    };

    const handleCopyLink = async () => {
        if (!shareToken) return;
        try {
            await copyLink(shareToken);
        } catch (e) {
            console.error('[copy-link] failed:', e);
        }
    };

    const handleUnshare = async () => {
        try {
            await api.delete(`/unshare-note/${noteId}`, { withCredentials: true });
            dispatch(updateNoteShareState({ noteId, isPublic: false, shareToken: null }));
            setOpen(false);
        } catch (e) {
            console.error('[unshare] failed:', e);
        }
    };

    return (
        <div className="relative" ref={ref}>
            {/* Icon trigger — matches IconBtn style in Note.jsx */}
            <button
                type="button"
                title={isPublic ? 'Sharing options' : 'Share note'}
                onClick={() => setOpen((v) => !v)}
                className={`flex items-center justify-center w-7 h-7 rounded-button
                    transition-colors duration-150
                    ${isPublic
                        ? 'text-accent dark:text-yellow-400 hover:bg-accent-subtle dark:hover:bg-yellow-900/20'
                        : 'text-ink-secondary dark:text-ink-inverse-secondary hover:bg-surface-inset dark:hover:bg-dark-inset hover:text-ink dark:hover:text-ink-inverse'
                    }
                    ${open ? 'bg-surface-inset dark:bg-dark-inset' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="currentColor" className="w-4 h-4">
                    <path d="M13 4.5a2.5 2.5 0 1 1 .702 1.737L6.97 9.604a2.518 2.518 0 0 1 0 .792l6.733 3.367a2.5 2.5 0 1 1-.671 1.341l-6.733-3.367a2.5 2.5 0 1 1 0-3.474l6.733-3.366A2.52 2.52 0 0 1 13 4.5z" />
                </svg>
            </button>

            {/* Popover panel */}
            {open && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20
                    w-52 p-3
                    bg-surface-raised dark:bg-dark-raised
                    border border-border dark:border-dark-border
                    rounded-panel shadow-elevated dark:shadow-elevated-dark">

                    {isPublic ? (
                        <>
                            {/* Truncated link preview */}
                            <input
                                readOnly
                                value={buildPublicLink(shareToken)}
                                onClick={(e) => e.target.select()}
                                className="w-full mb-2 px-2 py-1.5 text-caption
                                    bg-surface-inset dark:bg-dark-inset
                                    border border-border dark:border-dark-border
                                    rounded-input text-ink dark:text-ink-inverse
                                    cursor-pointer select-all outline-none
                                    focus:ring-2 focus:ring-accent/40"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCopyLink}
                                    className="flex-1 py-1.5 text-caption font-medium
                                        bg-accent hover:bg-accent-hover active:bg-accent-pressed
                                        text-accent-fg rounded-button
                                        transition-colors duration-150"
                                >
                                    {copied ? '✓ Copied' : 'Copy link'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUnshare}
                                    className="flex-1 py-1.5 text-caption font-medium
                                        border border-border dark:border-dark-border
                                        text-danger dark:text-red-400
                                        hover:bg-red-50 dark:hover:bg-red-900/20
                                        rounded-button transition-colors duration-150"
                                >
                                    Unshare
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={handleShare}
                            className="w-full py-1.5 text-caption font-medium
                                bg-accent hover:bg-accent-hover active:bg-accent-pressed
                                text-accent-fg rounded-button
                                transition-colors duration-150"
                        >
                            {copied ? '✓ Link copied!' : 'Share & copy link'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShareButton;
