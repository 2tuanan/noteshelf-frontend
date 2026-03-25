import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const TB_BASE = 'flex items-center justify-center w-7 h-7 rounded transition-colors duration-150';
const TB_ON   = 'bg-accent-subtle text-accent dark:bg-yellow-900/20 dark:text-yellow-300';
const TB_OFF  = 'text-ink-secondary dark:text-ink-inverse/60 hover:bg-surface dark:hover:bg-dark hover:text-ink dark:hover:text-ink-inverse';

const Divider = () => (
    <span className="w-px h-5 bg-border dark:bg-dark-border self-center mx-0.5 shrink-0" aria-hidden="true" />
);

const TiptapEditor = ({ content, onChange, onEditorReady }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '', false);
        }
    }, [content, editor]);

    useEffect(() => {
        onEditorReady?.(editor);
        return () => onEditorReady?.(null);
    }, [editor, onEditorReady]);

    const tbBtn = (active, onClick, label, icon) => (
        <button
            key={label}
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={onClick}
            className={`${TB_BASE} ${active ? TB_ON : TB_OFF}`}
        >
            {icon}
        </button>
    );

    return (
        <div className="rounded-input border border-border dark:border-dark-border focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent/60 overflow-hidden transition-shadow duration-150">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-2 py-1.5 bg-surface-inset dark:bg-dark-inset border-b border-border dark:border-dark-border">

                {/* Group 1: Text format */}
                {tbBtn(
                    editor?.isActive('bold'),
                    () => editor?.chain().focus().toggleBold().run(),
                    'Bold',
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                        <path d="M6 4h8a4 4 0 0 1 0 8H6V4zm0 8h9a4 4 0 0 1 0 8H6v-8z" />
                    </svg>
                )}
                {tbBtn(
                    editor?.isActive('italic'),
                    () => editor?.chain().focus().toggleItalic().run(),
                    'Italic',
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <line x1="19" y1="4" x2="10" y2="4" />
                        <line x1="14" y1="20" x2="5" y2="20" />
                        <line x1="15" y1="4" x2="9" y2="20" />
                    </svg>
                )}

                <Divider />

                {/* Group 2: Headings */}
                {tbBtn(
                    editor?.isActive('heading', { level: 1 }),
                    () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
                    'Heading 1',
                    <span className="font-bold text-[11px] leading-none">H1</span>
                )}
                {tbBtn(
                    editor?.isActive('heading', { level: 2 }),
                    () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
                    'Heading 2',
                    <span className="font-bold text-[11px] leading-none">H2</span>
                )}

                <Divider />

                {/* Group 3: Lists */}
                {tbBtn(
                    editor?.isActive('bulletList'),
                    () => editor?.chain().focus().toggleBulletList().run(),
                    'Bullet list',
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <line x1="9" y1="6" x2="20" y2="6" />
                        <line x1="9" y1="12" x2="20" y2="12" />
                        <line x1="9" y1="18" x2="20" y2="18" />
                        <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
                        <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
                        <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
                    </svg>
                )}
                {tbBtn(
                    editor?.isActive('orderedList'),
                    () => editor?.chain().focus().toggleOrderedList().run(),
                    'Ordered list',
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="10" y1="6" x2="21" y2="6" />
                        <line x1="10" y1="12" x2="21" y2="12" />
                        <line x1="10" y1="18" x2="21" y2="18" />
                        <path d="M4 6h1v4" />
                        <path d="M4 10h2" />
                        <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                    </svg>
                )}
            </div>

            {/* Editor content */}
            <EditorContent
                editor={editor}
                aria-label="Note content editor"
                className="min-h-[80px] px-3 py-2.5 prose prose-sm dark:prose-invert max-w-none text-ink dark:text-ink-inverse bg-transparent focus:outline-none"
            />
        </div>
    );
};

export default TiptapEditor;
