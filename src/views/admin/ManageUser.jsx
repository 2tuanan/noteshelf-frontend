import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_users, reset_notes, messageClear, delete_user } from '../../store/Reducers/adminReducer';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';

const ManageUser = () => {
    const dispatch = useDispatch();
    const {users, resetLoader, deleteLoader, successMessage, errorMessage } = useSelector(state => state.admin)

    const resetNotes = (id) => {
        if (window.confirm('Are you sure you want to reset notes?'))
        dispatch(reset_notes(id))
    }

    const deleteUser = (id) => {
        if (window.confirm('Are you sure you want to delete user?'))
        dispatch(delete_user(id))
    }

    useEffect(() => {
        dispatch(get_users())
    }, [dispatch])

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch])

    return (
        <div className="font-montserrat px-4 sm:px-6 py-8 max-w-3xl mx-auto">
            <h1 className="text-heading font-bold mb-6 text-ink dark:text-ink-inverse">User Management</h1>
            <div className="bg-surface-raised dark:bg-dark-raised rounded-card shadow-card border border-border dark:border-dark-border p-4 transition-colors duration-200">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user._id} className="bg-surface-inset dark:bg-dark-inset p-4 mb-4 last:mb-0 rounded-card border border-border-subtle dark:border-dark-border-subtle transition-colors duration-200">
                            <h2 className="text-body font-semibold mb-0.5 text-ink dark:text-ink-inverse">{user.name}</h2>
                            <p className="text-small text-ink-secondary dark:text-ink-inverse-secondary mb-0.5">Email: {user.email}</p>
                            <p className="text-small text-ink-secondary dark:text-ink-inverse-secondary mb-4">
                                Total Notes: <span className="font-medium text-ink dark:text-ink-inverse">{user.noteTotal || 0}</span>
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => resetNotes(user._id)}
                                    className="flex items-center justify-center min-w-[112px] min-h-[34px] px-btn-x
                                        bg-accent hover:bg-accent-hover active:scale-95
                                        text-accent-fg text-small font-medium rounded-button
                                        transition-all duration-150">
                                    {resetLoader === user._id
                                        ? <BeatLoader size={6} color="#1A1714" />
                                        : 'Reset Notes'}
                                </button>
                                <button
                                    onClick={() => deleteUser(user._id)}
                                    className="flex items-center justify-center min-w-[112px] min-h-[34px] px-btn-x
                                        bg-red-500 hover:bg-red-600 active:scale-95
                                        text-white text-small font-medium rounded-button
                                        transition-all duration-150">
                                    {deleteLoader === user._id
                                        ? <BeatLoader size={6} color="#ffffff" />
                                        : 'Delete User'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-small text-ink-secondary dark:text-ink-inverse-secondary py-8">No users found</p>
                )}
            </div>
        </div>
    );
};

export default ManageUser;