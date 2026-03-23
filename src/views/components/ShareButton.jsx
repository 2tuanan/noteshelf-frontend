import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../api/api';
import { updateNoteShareState } from '../../store/Reducers/noteReducer';

const ShareButton = ({ noteId, isPublic, shareToken }) => {
    const dispatch = useDispatch();
    const [copied, setCopied] = useState(false);

    const buildPublicLink = (token) => `${window.location.origin}/s/${token}`;

    const copyLink = async (token) => {
        const link = buildPublicLink(token);
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(link)
        } else {
            window.prompt('Copy this public note link', link)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    };

    const handleShare = async () => {
        try {
            const { data } = await api.post(
                `/share-note/${noteId}`, {}, { withCredentials: true }
            )
            await copyLink(data.shareToken)
            dispatch(updateNoteShareState({
                noteId, isPublic: true, shareToken: data.shareToken
            }))
        } catch (e) {
            console.error('[share] failed:', e)
        }
    };

    const handleCopyLink = async () => {
        try {
            if (!shareToken) return;
            await copyLink(shareToken)
        } catch (e) {
            console.error('[copy-link] failed:', e)
        }
    };

    const handleUnshare = async () => {
        try {
            await api.delete(`/unshare-note/${noteId}`, 
                { withCredentials: true }
            )
            dispatch(updateNoteShareState({
                noteId, isPublic: false, shareToken: null
            }))
        } catch (e) {
            console.error('[unshare] failed:', e)
        }
    };

    if (isPublic) {
        return (
            <div className="flex flex-col gap-1 mt-1">
                <input
                    readOnly
                    value={buildPublicLink(shareToken)}
                    className="text-xs border rounded px-2 py-1 w-full bg-gray-50 dark:bg-gray-700 dark:text-white cursor-pointer select-all"
                    onClick={e => e.target.select()}
                />
                <div className="flex gap-2">
                    <button
                        onClick={handleCopyLink}
                        className="text-xs text-blue-600 hover:underline">
                        {copied ? '✓ Copied!' : '📋 Copy link'}
                    </button>
                    <button
                        onClick={handleUnshare}
                        className="text-xs text-red-500 hover:underline">
                        Unshare
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button onClick={handleShare} className="text-xs text-blue-600 hover:underline">
            {copied ? '✓ Copied!' : '🔗 Share'}
        </button>
    );
};

export default ShareButton;
