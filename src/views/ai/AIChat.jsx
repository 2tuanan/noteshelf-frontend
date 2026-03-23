import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addUserMessage,
    appendStreamToken,
    finalizeAssistantMessage,
    setChatNoteId
} from '../../store/Reducers/aiReducer';

const AIChat = ({ noteId, onClose }) => {
    const dispatch = useDispatch();
    const { chatMessages, chatStreaming, streamingContent } = useSelector(s => s.ai);
    const [input, setInput] = useState('');

    useEffect(() => {
        dispatch(setChatNoteId(noteId));
    }, [dispatch, noteId]);

    const handleSend = async () => {
        if (!input.trim() || chatStreaming) return;
        const message = input.trim();
        setInput('');
        dispatch(addUserMessage(message));

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL ||
                    'http://localhost:4088/api'}/ai/chat`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ noteId, message, history: chatMessages.slice(-20) })
                }
            );

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value);
                const lines = text.split('\n').filter(l => l.startsWith('data: '));
                for (const line of lines) {
                    const payload = JSON.parse(line.slice(6));
                    if (payload.token) dispatch(appendStreamToken(payload.token));
                    if (payload.done || payload.error) {
                        dispatch(finalizeAssistantMessage());
                    }
                }
            }
        } catch (error) {
            dispatch(finalizeAssistantMessage());
        }
    };

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl flex flex-col z-50">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                <h3 className="font-semibold dark:text-white">Ask about this note</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((m, i) => (
                    <div
                        key={`${m.role}-${i}`}
                        className={`text-sm p-2 rounded-lg ${m.role === 'user'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 ml-8 text-right'
                            : 'bg-gray-100 dark:bg-gray-800 mr-8'}`}
                    >
                        {m.content}
                    </div>
                ))}
                {chatStreaming && streamingContent && (
                    <div className="text-sm p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mr-8">
                        {streamingContent}<span className="animate-pulse">▋</span>
                    </div>
                )}
            </div>
            <div className="p-4 border-t dark:border-gray-700 flex gap-2">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    disabled={chatStreaming}
                    placeholder="Ask a question..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none
                               focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-white"
                />
                <button
                    onClick={handleSend}
                    disabled={chatStreaming}
                    className="px-3 py-2 bg-yellow-400 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default AIChat;
