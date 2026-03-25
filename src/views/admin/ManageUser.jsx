import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_users, reset_notes, messageClear, delete_user } from '../../store/Reducers/adminReducer';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        className="w-4 h-4" aria-hidden="true">
        <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 0 1 .678 0 11.947 11.947 0 0 0 7.078 2.749.5.5 0 0 1 .479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 0 1-.332 0C5.26 16.563 2 12.162 2 7c0-.538.035-1.069.104-1.589a.5.5 0 0 1 .48-.425 11.947 11.947 0 0 0 7.077-2.749zm4.196 5.954a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);

const ManageUser = () => {
    const dispatch = useDispatch();
    const { users, resetLoader, deleteLoader, successMessage, errorMessage } = useSelector((state) => state.admin);

    const resetNotes = (id) => {
        if (window.confirm('Reset all notes for this user? This cannot be undone.'))
            dispatch(reset_notes(id));
    };

    const deleteUser = (id) => {
        if (window.confirm('Permanently delete this user and all their data?'))
            dispatch(delete_user(id));
    };

    useEffect(() => { dispatch(get_users()); }, [dispatch]);

    useEffect(() => {
        if (successMessage) { toast.success(successMessage); dispatch(messageClear()); }
        if (errorMessage)   { toast.error(errorMessage);   dispatch(messageClear()); }
    }, [successMessage, errorMessage, dispatch]);

    return (
        <div className="font-montserrat px-4 sm:px-6 py-8 max-w-4xl mx-auto">

            {/* ── Page header ── */}
            <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-2">
                    <h1 className="text-heading font-semibold text-ink dark:text-ink-inverse
                        leading-none">
                        User Management
                    </h1>
                    {/* Admin authority badge */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5
                        bg-accent-subtle text-accent
                        border border-accent/30
                        rounded-badge text-caption font-medium">
                        <ShieldIcon />
                        Admin
                    </span>
                </div>
                <div className="ml-auto text-small text-ink-secondary dark:text-ink-inverse-secondary">
                    {users.length} user{users.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* ── Desktop table / Mobile card list ── */}
            <div className="bg-surface-raised dark:bg-dark-raised
                border border-border dark:border-dark-border
                rounded-card shadow-card
                overflow-hidden
                transition-colors duration-200">

                {users.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-body text-ink-secondary dark:text-ink-inverse-secondary">
                            No users found
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop table — hidden on mobile */}
                        <table className="hidden sm:table w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-inset dark:bg-dark-inset
                                    border-b border-border dark:border-dark-border">
                                    <th className="px-5 py-3 text-caption font-medium
                                        text-ink-secondary dark:text-ink-inverse-secondary
                                        uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-5 py-3 text-caption font-medium
                                        text-ink-secondary dark:text-ink-inverse-secondary
                                        uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-5 py-3 text-caption font-medium
                                        text-ink-secondary dark:text-ink-inverse-secondary
                                        uppercase tracking-wider text-right">
                                        Notes
                                    </th>
                                    <th className="px-5 py-3 text-caption font-medium
                                        text-ink-secondary dark:text-ink-inverse-secondary
                                        uppercase tracking-wider text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, idx) => (
                                    <tr key={user._id}
                                        className={`
                                            group border-b border-border-subtle dark:border-dark-border-subtle
                                            last:border-0
                                            hover:bg-accent-subtle dark:hover:bg-yellow-900/10
                                            transition-colors duration-100
                                            ${idx % 2 === 0 ? '' : 'bg-surface-inset/40 dark:bg-dark-inset/30'}
                                        `}>
                                        <td className="px-5 py-3.5">
                                            <span className="text-small font-semibold
                                                text-ink dark:text-ink-inverse">
                                                {user.name}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-small
                                                text-ink-secondary dark:text-ink-inverse-secondary">
                                                {user.email}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <span className="text-small font-medium
                                                text-ink dark:text-ink-inverse">
                                                {user.noteTotal || 0}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Ghost reset */}
                                                <button
                                                    onClick={() => resetNotes(user._id)}
                                                    className="inline-flex items-center justify-center
                                                        min-w-[90px] h-[30px] px-btn-sm-x
                                                        border border-border dark:border-dark-border
                                                        bg-transparent hover:bg-surface-inset dark:hover:bg-dark-inset
                                                        text-ink-secondary dark:text-ink-inverse-secondary
                                                        text-caption font-medium rounded-button
                                                        transition-all duration-150">
                                                    {resetLoader === user._id
                                                        ? <BeatLoader size={4} color="#706B65" />
                                                        : 'Reset Notes'}
                                                </button>
                                                {/* Danger delete */}
                                                <button
                                                    onClick={() => deleteUser(user._id)}
                                                    className="inline-flex items-center justify-center
                                                        min-w-[70px] h-[30px] px-btn-sm-x
                                                        bg-red-500 hover:bg-red-600 active:scale-95
                                                        text-white text-caption font-medium rounded-button
                                                        transition-all duration-150">
                                                    {deleteLoader === user._id
                                                        ? <BeatLoader size={4} color="#ffffff" />
                                                        : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile card list — shown only on xs */}
                        <ul className="sm:hidden divide-y divide-border-subtle dark:divide-dark-border-subtle">
                            {users.map((user) => (
                                <li key={user._id}
                                    className="px-4 py-4
                                        hover:bg-accent-subtle dark:hover:bg-yellow-900/10
                                        transition-colors duration-100">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="min-w-0">
                                            <p className="text-small font-semibold
                                                text-ink dark:text-ink-inverse truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-caption
                                                text-ink-secondary dark:text-ink-inverse-secondary
                                                truncate mt-0.5">
                                                {user.email}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-caption
                                            text-ink-secondary dark:text-ink-inverse-secondary">
                                            {user.noteTotal || 0} note{(user.noteTotal || 0) !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => resetNotes(user._id)}
                                            className="flex-1 flex items-center justify-center h-8
                                                border border-border dark:border-dark-border
                                                bg-transparent hover:bg-surface-inset dark:hover:bg-dark-inset
                                                text-ink-secondary dark:text-ink-inverse-secondary
                                                text-caption font-medium rounded-button
                                                transition-all duration-150">
                                            {resetLoader === user._id
                                                ? <BeatLoader size={4} color="#706B65" />
                                                : 'Reset Notes'}
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="flex-1 flex items-center justify-center h-8
                                                bg-red-500 hover:bg-red-600 active:scale-95
                                                text-white text-caption font-medium rounded-button
                                                transition-all duration-150">
                                            {deleteLoader === user._id
                                                ? <BeatLoader size={4} color="#ffffff" />
                                                : 'Delete'}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default ManageUser;