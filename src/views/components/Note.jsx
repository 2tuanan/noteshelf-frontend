import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { update_note } from '../../store/Reducers/noteReducer';
import DOMPurify from 'dompurify';
import TiptapEditor from './TiptapEditor';
import AISummary from '../ai/AISummary';
import AIChat from '../ai/AIChat';
import ShareButton from './ShareButton';
import ExportMenu from './ExportMenu';

const tagColors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
];

const Note = (props) => {
    const dispatch = useDispatch();
    const [isPopoverOpen, setIsPopoverOpen] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(props.title);
    const [editContent, setEditContent] = useState(props.content);
    const [showChat, setShowChat] = useState(false);

    const handlePopoverToggle = (id) => {
        const popover = document.getElementById(id);
        if (popover) {
            setIsPopoverOpen(!isPopoverOpen);
        }
    }

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
    
    return (
        <div className='bg-[#fff] p-2 ml-3 mb-4 sm:m-4 w-[170px] sm:w-[240px] float-left shadow-md rounded-lg border dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:shadow-gray-700/30 transition-colors duration-200'>
            {!isEditing ? (
                <>
                    <h1 className='text-sm sm:text-base mb-1'>{props.title}</h1>
                    {props.contentType === 'html' ||
                    (props.content && props.content.trim().startsWith('<')) ? (
                        <div
                            className='text-sm mb-2 prose dark:prose-invert max-w-none'
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(props.content)
                            }}
                        />
                    ) : (
                        <p className='text-sm mb-2 whitespace-pre-wrap break-words'>{props.content}</p>
                    )}
                    {props.tags && props.tags.length > 0 && (
                        <div className='flex flex-wrap gap-1 mt-2'>
                            {props.tags.map((tag, i) => (
                                <span
                                    key={tag}
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[i % tagColors.length]}`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <ShareButton
                        noteId={props.id}
                        isPublic={props.isPublic}
                        shareToken={props.shareToken}
                    />
                    <ExportMenu noteId={props.id} />
                    <AISummary noteId={props.id} />
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className='text-xs px-2 py-1 bg-blue-100 rounded hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                    >💬 Chat</button>
                    <button
                        onClick={() => setIsEditing(true)}
                        className='relative px-2 py-1 text-xs sm:text-sm mr-2 text-[#f5ba13] border-none cursor-pointer'
                    >Edit</button>
                </>
            ) : (
                <>
                    <input
                        type='text'
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className='text-sm sm:text-base mb-2 w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 transition-colors duration-200'
                    />
                    <TiptapEditor
                        content={editContent}
                        onChange={(html) => setEditContent(html)}
                    />
                    <button
                        onClick={handleSave}
                        className='relative px-2 py-1 text-xs sm:text-sm mr-2 text-[#f5ba13] border-none cursor-pointer'
                    >Save</button>
                    <button
                        onClick={handleCancel}
                        className='relative px-2 py-1 text-xs sm:text-sm mr-2 text-[#f5ba13] border-none cursor-pointer'
                    >Cancel</button>
                </>
            )}
            <button
                onClick={() => {props.onDelete(props.id)}}
                className='relative w-7 h-7 sm:w-9 sm:h-9 float-right mr-2 text-[#f5ba13] border-none 
                cursor-pointer outline-none hover:transform hover:scale-105 transition-all duration-500'>X</button>
            {showChat && (
                <AIChat
                    noteId={props.id}
                    onClose={() => setShowChat(false)}
                />
            )}
        </div>
    );
};

export default Note;