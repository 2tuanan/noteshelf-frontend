import React, { useEffect, useState } from 'react';
import CreateArea from '../components/CreateArea';
import Note from '../components/Note';
import { useDispatch, useSelector } from 'react-redux';
import { add_note, delete_note, get_notes, messageClear } from '../../store/Reducers/noteReducer';
import toast from 'react-hot-toast';

const EmptyState = ({ isSearch, query }) => (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
        <span className="flex items-center justify-center w-16 h-16 rounded-panel bg-accent-subtle text-accent">
            {isSearch ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                    className="w-8 h-8" aria-hidden="true">
                    <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.683a1 1 0 0 1 .633.633l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684z" />
                </svg>
            )}
        </span>
        <div className="space-y-1">
            <p className="text-body font-medium text-ink dark:text-ink-inverse">
                {isSearch ? `No results for \u201c${query}\u201d` : 'No notes yet'}
            </p>
            <p className="text-small text-ink-secondary dark:text-ink-inverse-secondary">
                {isSearch ? 'Try different keywords' : 'Create your first note above'}
            </p>
        </div>
    </div>
);

const MainPage = () => {
    const dispatch = useDispatch();
    const { notes, loader, successMessage, errorMessage, searchResults, searchQuery } = useSelector((state) => state.note);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState({ title: '', content: '' });
    const displayNotes = searchQuery ? searchResults : notes;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(add_note(input));
    };

    const deleteNote = (id) => {
        if (window.confirm('Are you sure you want to delete this note?'))
            dispatch(delete_note(id));
    };

    useEffect(() => { dispatch(get_notes()); }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setInput({ title: '', content: '' });
            setIsExpanded(false);
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    return (
        <div className="font-montserrat pb-10">
            {/* Note creation form — self-centering (w-[520px] mx-auto inside CreateArea) */}
            <CreateArea
                input={input}
                handleChange={handleChange}
                setInput={setInput}
                submitHandler={submitHandler}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                loader={loader}
            />

            {/* Search metadata */}
            {searchQuery && displayNotes.length > 0 && (
                <p className="text-small text-ink-secondary dark:text-ink-inverse-secondary
                    px-4 sm:px-6 max-w-7xl mx-auto mb-4">
                    {displayNotes.length} result{displayNotes.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
                </p>
            )}

            {/* Note board — CSS grid fills left-to-right (row-major).
             * This prevents the phantom empty column that CSS columns create
             * when fewer notes than column-count exist. */}
            {displayNotes.length > 0 ? (
                <div className="px-4 pt-6 sm:px-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
                        {displayNotes.map((note) => {
                            if (!note || !note._id) return null;
                            return (
                                <div key={note._id}>
                                    <Note
                                        id={note._id}
                                        title={note.title}
                                        content={note.content}
                                        contentType={note.contentType}
                                        tags={note.tags || []}
                                        summary={note.summary || ''}
                                        isPublic={note.isPublic || false}
                                        shareToken={note.shareToken || null}
                                        onDelete={deleteNote}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <EmptyState isSearch={Boolean(searchQuery)} query={searchQuery} />
            )}
        </div>
    );
};

export default MainPage;