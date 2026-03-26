import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { update_note } from '../../store/Reducers/noteReducer';
import DOMPurify from 'dompurify';
import TiptapEditor from './TiptapEditor';
import AISummary from '../ai/AISummary';
import AIChat from '../ai/AIChat';
import ShareButton from './ShareButton';
import ExportMenu from './ExportMenu';

// Warm-adjusted tag palette aligned with design tokens
const tagColors = [
    'bg-tag-blue   text-tag-blue-text   dark:bg-blue-900/30  dark:text-blue-300',
    'bg-tag-green  text-tag-green-text  dark:bg-green-900/30 dark:text-green-300',
    'bg-tag-purple text-tag-purple-text dark:bg-purple-900/30 dark:text-purple-300',
    'bg-tag-amber  text-tag-amber-text  dark:bg-yellow-900/30 dark:text-yellow-300',
    'bg-tag-pink   text-tag-pink-text   dark:bg-pink-900/30  dark:text-pink-300',
];

// Minimal SVG icon components — no extra dependencies
const IconEdit = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343z" />
    </svg>
);
const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193v-.443A2.75 2.75 0 0 0 11.25 1h-2.5zm0 1.5h2.5c.69 0 1.25.56 1.25 1.25v.25h-5v-.25c0-.69.56-1.25 1.25-1.25zM9.25 8.5a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0V8.5zm3 0a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0V8.5z" clipRule="evenodd" />
    </svg>
);
const IconSave = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143z" clipRule="evenodd" />
    </svg>
);
const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
);
const IconSparkle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.683a1 1 0 0 1 .633.633l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684z" />
    </svg>
);
// Reusable icon-button with shared hover style
const IconBtn = ({ onClick, ariaLabel, children, className = '' }) => (
    <button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        className={`flex items-center justify-center w-7 h-7 rounded-button
            text-ink-secondary dark:text-ink-inverse-secondary
            hover:bg-surface-inset dark:hover:bg-dark-inset
            hover:text-ink dark:hover:text-ink-inverse
            transition-colors duration-150 ${className}`}
    >
        {children}
    </button>
);

const Note = (props) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing]     = useState(false);
    const [editTitle, setEditTitle]     = useState(props.title);
    const [editContent, setEditContent] = useState(props.content);
    const [showChat, setShowChat]       = useState(false);
    const [summaryOpen, setSummaryOpen] = useState(false);
    const editorRef = React.useRef(null);

    useEffect(() => {
        if (!isEditing) {
            setEditTitle(props.title);
            setEditContent(props.content);
        }
    }, [props.title, props.content, isEditing]);

    const handleSave = () => {
        dispatch(update_note({ id: props.id, data: { title: editTitle, content: editContent } }));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(props.title);
        setEditContent(props.content);
        setIsEditing(false);
    };

    const handleTitleKeyDown = (e) => {
        if (e.key !== 'Tab' || e.shiftKey) return;

        e.preventDefault();
        editorRef.current?.commands.focus('start');
    };

    const isHtml = props.contentType === 'html' ||
        (props.content && props.content.trim().startsWith('<'));

    return (
        <div className={
            'group relative flex flex-col ' +
            'bg-surface-raised dark:bg-dark-raised ' +
            'border border-border dark:border-dark-border ' +
            'rounded-card shadow-card dark:shadow-card-dark ' +
            'px-card-x py-card-y ' +
            'w-full ' +
            'transition-shadow duration-200 hover:shadow-elevated dark:hover:shadow-elevated-dark'
        }>
            {/* ── View mode ─────────────────────────────────────────── */}
            {!isEditing ? (
                <>
                    {/* Header row: title + delete (appears on hover) */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h2 className="text-subheading font-montserrat font-semibold leading-snug
                            text-ink dark:text-ink-inverse flex-1 min-w-0 break-words">
                            {String(props.title ?? '')}
                        </h2>
                        <IconBtn
                            ariaLabel="Delete note"
                            onClick={() => props.onDelete(props.id)}
                            className="shrink-0 opacity-0 group-hover:opacity-100
                                hover:!bg-red-50 hover:!text-danger
                                dark:hover:!bg-red-900/20 dark:hover:!text-red-400"
                        >
                            <IconTrash />
                        </IconBtn>
                    </div>

                    {/* Content snippet — clamped to 4 lines */}
                    <div className="mb-3 flex-1">
                        {isHtml ? (
                            <div
                                className="text-body text-ink-secondary dark:text-ink-inverse-secondary
                                    prose prose-sm dark:prose-invert max-w-none
                                    line-clamp-4 [&>*]:my-0"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(props.content)
                                }}
                            />
                        ) : (
                            <p className="text-body text-ink-secondary dark:text-ink-inverse-secondary
                                line-clamp-4 whitespace-pre-wrap break-words">
                                {String(props.content ?? '')}
                            </p>
                        )}
                    </div>

                    {/* Tags */}
                    {props.tags && props.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {props.tags.map((tag, i) => (
                                <span
                                    key={tag}
                                    className={`text-caption px-2 py-0.5 rounded-badge font-medium
                                        ${tagColors[i % tagColors.length]}`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Collapsible AI summary */}
                    <AISummary
                        noteId={props.id}
                        open={summaryOpen}
                        onToggle={() => setSummaryOpen((v) => !v)}
                    />

                    {/* Divider */}
                    <div className="border-t border-border-subtle dark:border-dark-border-subtle mt-3 pt-2" />

                    {/* Icon toolbar */}
                    <div className="flex items-center gap-0.5">
                        {/* Edit */}
                        <IconBtn ariaLabel="Edit note" onClick={() => setIsEditing(true)}>
                            <IconEdit />
                        </IconBtn>

                        {/* Share — delegates full UI to ShareButton */}
                        <ShareButton
                            noteId={props.id}
                            isPublic={props.isPublic}
                            shareToken={props.shareToken}
                        />

                        {/* Export */}
                        <ExportMenu noteId={props.id} />

                        {/* AI Chat */}
                        <IconBtn
                            ariaLabel="Chat with AI about this note"
                            onClick={() => setShowChat((v) => !v)}
                            className={showChat
                                ? 'bg-accent-subtle text-accent dark:bg-yellow-900/20 dark:text-yellow-300'
                                : ''}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM7 9a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm7 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
                            </svg>
                        </IconBtn>

                        {/* AI Summarize — in toolbar for easy access */}
                        <IconBtn
                            ariaLabel="Summarize with AI"
                            onClick={() => setSummaryOpen(true)}
                        >
                            <IconSparkle />
                        </IconBtn>
                    </div>
                </>
            ) : (
                /* ── Edit mode ──────────────────────────────────────── */
                <>
                    <input
                        type="text"
                        aria-label="Note title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={handleTitleKeyDown}
                        placeholder="Title"
                        className="w-full mb-3 px-input-x py-input-y text-subheading font-semibold
                            bg-surface-inset dark:bg-dark-inset
                            border border-border dark:border-dark-border
                            rounded-input text-ink dark:text-ink-inverse
                            placeholder:text-ink-tertiary dark:placeholder:text-ink-inverse-tertiary
                            outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent
                            transition-colors duration-150"
                    />
                    <TiptapEditor
                        content={editContent}
                        onEditorReady={(editor) => { editorRef.current = editor; }}
                        onChange={(html) => setEditContent(html)}
                    />
                    <div className="flex items-center gap-2 mt-3">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1.5 px-btn-x py-btn-sm-y
                                bg-accent hover:bg-accent-hover active:bg-accent-pressed
                                text-accent-fg text-small font-semibold
                                rounded-button shadow-sm
                                transition-colors duration-150"
                        >
                            <IconSave /> Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-1.5 px-btn-x py-btn-sm-y
                                bg-surface-inset dark:bg-dark-inset
                                hover:bg-border dark:hover:bg-dark-border
                                text-ink-secondary dark:text-ink-inverse-secondary
                                text-small font-medium
                                rounded-button border border-border dark:border-dark-border
                                transition-colors duration-150"
                        >
                            <IconX /> Cancel
                        </button>
                    </div>
                </>
            )}

            {/* AI Chat panel */}
            {showChat && (
                <AIChat
                    noteId={props.id}
                    noteTitle={props.title}
                    onClose={() => setShowChat(false)}
                />
            )}
        </div>
    );
};

export default Note;