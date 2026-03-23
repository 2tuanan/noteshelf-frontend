import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const AISummary = ({ noteId }) => {
    const [streamingSummary, setStreamingSummary] = useState('');
    const [streaming, setStreaming] = useState(false);
    const note = useSelector((state) =>
        state.note.notes.find((noteItem) => noteItem._id === noteId)
    );
    const savedSummary = note?.summary || '';
    const displaySummary = streaming ? streamingSummary : savedSummary;

    const handleSummarize = async () => {
        setStreamingSummary('');
        setStreaming(true);
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL || 'http://localhost:4088/api'}/ai/summarize/${noteId}`,
                { method: 'POST', credentials: 'include' }
            );
            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value);
                const lines = text.split('\n').filter((line) => line.startsWith('data: '));
                for (const line of lines) {
                    const payload = JSON.parse(line.slice(6));
                    if (payload.token) {
                        setStreamingSummary((prev) => prev + payload.token);
                    }
                    if (payload.done || payload.error) {
                        setStreaming(false);
                    }
                }
            }
        } catch (error) {
            console.error('Summarize failed:', error);
        } finally {
            setStreaming(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleSummarize}
                disabled={streaming}
                className='text-xs px-2 py-1 bg-yellow-100 rounded hover:bg-yellow-200 dark:bg-yellow-900/30'
            >
                {streaming ? 'Summarizing...' : '✨ Summarize'}
            </button>
            {displaySummary && (
                <p className='mt-2 text-sm italic text-gray-600 dark:text-gray-300 border-l-2 border-yellow-400 pl-2'>
                    {displaySummary}
                </p>
            )}
        </div>
    );
};

export default AISummary;
