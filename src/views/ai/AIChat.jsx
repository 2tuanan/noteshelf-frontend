import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addUserMessage,
    appendStreamToken,
    finalizeAssistantMessage,
    setChatNoteId,
} from '../../store/Reducers/aiReducer';

// Three staggered bouncing dots
const TypingDots = () => (
    <span className="inline-flex items-center gap-[3px] py-0.5">
        {[0, 1, 2].map((i) => (
            <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-ink-secondary dark:bg-ink-inverse-secondary"
                style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
            />
        ))}
    </span>
);

const SparkIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
        <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.683a1 1 0 0 1 .633.633l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684z" />
    </svg>
);

const AIChat = ({ noteId, noteTitle, onClose }) => {
    const dispatch = useDispatch();
    const { chatMessages, chatStreaming, streamingContent } = useSelector((s) => s.ai);
    const [input, setInput] = useState('');
    const [visible, setVisible] = useState(false);
    const panelRef = useRef(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Slide-in animation on mount
    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (!visible) return undefined;
        const focusTimer = requestAnimationFrame(() => {
            textareaRef.current?.focus();
        });
        return () => cancelAnimationFrame(focusTimer);
    }, [visible]);

    useEffect(() => {
        dispatch(setChatNoteId(noteId));
    }, [dispatch, noteId]);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, streamingContent]);

    const handleSend = async () => {
        if (!input.trim() || chatStreaming) return;
        const message = input.trim();
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = '38px';
        dispatch(addUserMessage(message));

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL || 'http://localhost:4088/api'}/ai/chat`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ noteId, message, history: chatMessages.slice(-20) }),
                }
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
                    if (payload.token) dispatch(appendStreamToken(payload.token));
                    if (payload.done || payload.error) dispatch(finalizeAssistantMessage());
                }
            }
        } catch {
            dispatch(finalizeAssistantMessage());
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void handleSend();
        }
        if (e.key === 'Escape') {
            onClose();
        }
    };

    // Also allow Escape from anywhere in the panel
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    const handlePanelKeyDown = (e) => {
        if (e.key !== 'Tab') return;

        const focusableSelector = [
            'button:not([disabled])',
            'textarea:not([disabled])',
            'a[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ].join(',');

        const focusable = panelRef.current?.querySelectorAll(focusableSelector);
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    const isEmpty = chatMessages.length === 0 && !chatStreaming;

    return (
        <>
            {/* Backdrop scrim */}
            <div
                className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-[1px]"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-in panel */}
            <aside
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="AI Chat"
                onKeyDown={handlePanelKeyDown}
                className={`fixed right-0 top-0 h-full z-50 flex flex-col w-[360px]
                    bg-surface-raised dark:bg-dark-raised
                    shadow-panel rounded-l-panel
                    border-l border-border dark:border-dark-border
                    transition-transform duration-300 ease-out
                    ${visible ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 px-panel-x py-4
                    border-b border-border dark:border-dark-border shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex items-center justify-center w-7 h-7
                            rounded-button bg-accent-subtle text-accent shrink-0">
                            <SparkIcon className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-caption font-semibold text-ink dark:text-ink-inverse leading-tight">
                                AI Chat
                            </p>
                            {noteTitle && (
                                <p className="text-caption text-ink-secondary dark:text-ink-inverse-secondary
                                    truncate leading-tight mt-0.5">
                                    {noteTitle}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close chat"
                        className="flex items-center justify-center w-7 h-7 rounded-button shrink-0
                            text-ink-secondary dark:text-ink-inverse-secondary
                            hover:bg-surface-inset dark:hover:bg-dark-inset
                            hover:text-ink dark:hover:text-ink-inverse
                            transition-colors duration-150"
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                    </button>
                </div>

                {/* Message list — aria-live announces incoming streamed tokens */}
                <div
                    className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                    aria-live="polite"
                    aria-label="Chat messages"
                    aria-atomic="false"
                >
                    {isEmpty ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-center pb-8">
                            <span className="flex items-center justify-center w-12 h-12
                                rounded-panel bg-accent-subtle text-accent">
                                <SparkIcon className="w-6 h-6" />
                            </span>
                            <p className="text-small text-ink-secondary dark:text-ink-inverse-secondary max-w-[200px]">
                                Ask me anything about this note
                            </p>
                        </div>
                    ) : (
                        chatMessages.map((m, i) => (
                            <div
                                key={`${m.role}-${i}`}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[82%] px-3 py-2 text-small leading-relaxed
                                    ${ m.role === 'user'
                                        ? 'bg-accent-subtle dark:bg-yellow-900/20 text-ink dark:text-ink-inverse rounded-l-2xl rounded-tr-2xl rounded-br-sm'
                                        : 'bg-surface-inset dark:bg-dark-inset text-ink dark:text-ink-inverse rounded-r-2xl rounded-tl-2xl rounded-bl-sm'
                                    }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Streaming assistant response */}
                    {chatStreaming && (
                        <div className="flex justify-start">
                            <div className="max-w-[82%] px-3 py-2 text-small leading-relaxed
                                bg-surface-inset dark:bg-dark-inset text-ink dark:text-ink-inverse
                                rounded-r-2xl rounded-tl-2xl rounded-bl-sm">
                                {streamingContent ? (
                                    <>
                                        {streamingContent}
                                        <span className="inline-block w-px h-3 bg-accent ml-0.5 opacity-75 animate-pulse" />
                                    </>
                                ) : (
                                    <TypingDots />
                                )}
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input footer */}
                <div className="px-4 py-3 border-t border-border dark:border-dark-border
                    bg-surface dark:bg-dark shrink-0">
                    <div className="flex gap-2 items-end">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            aria-label="Message input"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
                            }}
                            onKeyDown={handleKeyDown}
                            disabled={chatStreaming}
                            placeholder="Ask a question…"
                            className="flex-1 resize-none overflow-hidden
                                rounded-input border border-border dark:border-dark-border
                                bg-surface-inset dark:bg-dark-inset
                                text-small text-ink dark:text-ink-inverse
                                placeholder:text-ink-secondary/50 dark:placeholder:text-ink-inverse-secondary/50
                                px-3 py-2 outline-none
                                focus:ring-2 focus:ring-accent/40 focus:border-accent/60
                                transition-shadow duration-150
                                disabled:opacity-50"
                            style={{ height: '38px' }}
                        />
                        <button
                            type="button"
                            onClick={() => void handleSend()}
                            disabled={chatStreaming || !input.trim()}
                            aria-label="Send message"
                            className="flex items-center justify-center w-9 h-9 shrink-0
                                bg-accent hover:bg-accent-hover active:scale-95
                                text-accent-fg rounded-button
                                disabled:opacity-40 disabled:cursor-not-allowed
                                transition-all duration-150"
                        >
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                                <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.925A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.896 28.896 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.289z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AIChat;
