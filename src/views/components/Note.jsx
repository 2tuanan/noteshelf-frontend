import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { update_note } from '../../store/Reducers/noteReducer';

const Note = (props) => {
    const dispatch = useDispatch();
    const [isPopoverOpen, setIsPopoverOpen] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(props.title);
    const [editContent, setEditContent] = useState(props.content);

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
        <div className='bg-[#fff] p-2 ml-3 mb-4 sm:m-4 w-[170px] sm:w-[240px] float-left shadow-md rounded-lg border'>
            {!isEditing ? (
                <>
                    <h1 className='text-sm sm:text-base mb-1'>{props.title}</h1>
                    <p className='text-sm sm:text-base mb-2 whitespace-pre-wrap break-words'>{props.content}</p>
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
                        className='text-sm sm:text-base mb-2 w-full border rounded px-2 py-1'
                    />
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className='text-sm sm:text-base mb-2 w-full border rounded px-2 py-1'
                        rows={4}
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
        </div>
    );
};

export default Note;