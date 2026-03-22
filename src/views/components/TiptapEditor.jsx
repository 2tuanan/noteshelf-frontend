import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const TiptapEditor = ({ content, onChange }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        onUpdate: ({ editor: tiptapEditor }) => onChange(tiptapEditor.getHTML()),
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '', false);
        }
    }, [content, editor]);

    return (
        <div>
            <div className='flex gap-1 mb-2 flex-wrap'>
                <button
                    type='button'
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`px-2 py-1 text-sm rounded ${editor?.isActive('bold') ? 'bg-yellow-400 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                >
                    <strong>B</strong>
                </button>
                <button
                    type='button'
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`px-2 py-1 text-sm rounded ${editor?.isActive('italic') ? 'bg-yellow-400 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                >
                    <em>I</em>
                </button>
                <button
                    type='button'
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`px-2 py-1 text-sm rounded ${editor?.isActive('heading', { level: 1 }) ? 'bg-yellow-400 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                >
                    H1
                </button>
                <button
                    type='button'
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-2 py-1 text-sm rounded ${editor?.isActive('heading', { level: 2 }) ? 'bg-yellow-400 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                >
                    H2
                </button>
                <button
                    type='button'
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`px-2 py-1 text-sm rounded ${editor?.isActive('bulletList') ? 'bg-yellow-400 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                >
                    UL
                </button>
                <button
                    type='button'
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={`px-2 py-1 text-sm rounded ${editor?.isActive('orderedList') ? 'bg-yellow-400 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
                >
                    OL
                </button>
            </div>
            <EditorContent
                editor={editor}
                className='min-h-[80px] prose dark:prose-invert max-w-none focus:outline-none border rounded p-2 dark:bg-gray-700 dark:text-white'
            />
        </div>
    );
};

export default TiptapEditor;
