import React, { useEffect, useState } from 'react';
import CreateArea from '../components/CreateArea';
import Note from '../components/Note';
import { useDispatch, useSelector } from 'react-redux';
import { add_note, delete_note, get_notes, messageClear } from '../../store/Reducers/noteReducer';
import toast from 'react-hot-toast';

const MainPage = () => {
    const dispatch = useDispatch();
    const { notes, loader, successMessage, errorMessage, searchResults, searchQuery } = useSelector(state => state.note);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState({title: '', content: ''});
    const displayNotes = searchQuery ? searchResults : notes;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({...prev, [name]: value}));
    }

    const submitHandler =  (e) => {
        e.preventDefault();
        dispatch(add_note(input))
    }

    const deleteNote = (id) => {
        if (window.confirm('Are you sure you want to delete this note?'))
        dispatch(delete_note(id))
    }

    useEffect(() => {
        dispatch(get_notes())
    }, [dispatch])

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setInput({title: '', content: ''});
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch])

    return (
        <div className='min-h-screen bg-surface dark:bg-dark transition-colors duration-200'>
            <CreateArea
                input={input}
                handleChange={handleChange}
                setInput={setInput}
                submitHandler={submitHandler}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                loader={loader}
            />
            {searchQuery && (
                <p className="text-small text-ink-secondary dark:text-ink-inverse-secondary px-4 mb-2">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
            )}
            {displayNotes.map((note) => {
                if (!note || !note._id) return null;
                return (
                <Note
                    id={note._id}
                    key={note._id}
                    title={note.title}
                    content={note.content}
                    contentType={note.contentType}
                    tags={note.tags || []}
                    summary={note.summary || ''}
                    isPublic={note.isPublic || false}
                    shareToken={note.shareToken || null}
                    onDelete={deleteNote}
                />
                );
            })}
        </div>
    );
};

export default MainPage;