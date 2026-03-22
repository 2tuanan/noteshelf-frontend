import React, { useCallback, useEffect, useState } from 'react';
import CreateArea from '../components/CreateArea';
import Note from '../components/Note';
import SearchBar from '../components/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { add_note, clearSearch, delete_note, get_notes, messageClear, search_notes } from '../../store/Reducers/noteReducer';
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

    const handleSearch = useCallback((q) => {
        dispatch(search_notes(q));
    }, [dispatch]);

    const handleClear = useCallback(() => {
        dispatch(clearSearch());
    }, [dispatch]);

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
        <div>
            <CreateArea 
                input={input}
                handleChange={handleChange}
                submitHandler={submitHandler}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                loader={loader}
            />
            <SearchBar
                onSearch={handleSearch}
                onClear={handleClear}
            />
            {searchQuery && (
                <p className="text-sm text-gray-500 px-4 mb-2">
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
                    onDelete={deleteNote}
                />
                );
            })}
        </div>
    );
};

export default MainPage;