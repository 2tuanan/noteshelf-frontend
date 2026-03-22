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

    const overrideStyle = {
        display: 'flex',
        margin: '0 auto',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
    }

    return (
        <div className='px-4 mt-8 font-montserrat bg-gray-100 dark:bg-gray-900 dark:text-white transition-colors duration-200'>
            <h1 className='text-2xl font-bold mb-4 text-center'>Management</h1>
            <div className='max-w-[800px] mx-auto bg-[#fff] p-4 rounded-lg shadow-md border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 transition-colors duration-200'>
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user._id} className='bg-[#f9f9f9] p-3 mb-5 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 transition-colors duration-200'>
                            <h2 className='text-lg font-semibold mb-1'>{user.name}</h2>
                            <p className='text-sm mb-1'>Email: {user.email}</p>
                            <p className='text-sm mb-3'>Total Notes: <span className='font-medium'>{user.noteTotal || 0}</span></p>
                            <div className='flex gap-3'>
                                <button onClick={()=>resetNotes(user._id)} className='w-28 bg-[#f5ba13] text-white py-2 rounded-md shadow-md text-sm 
                                    hover:transform hover:scale-105 transition-all duration-500'>
                                    {resetLoader === user._id ?(
                                        <BeatLoader cssOverride={overrideStyle} size={10} color='white'/>
                                    ) : (
                                        'Reset Notes'
                                    )}
                                </button>
                                <button onClick={()=>deleteUser(user._id)} className='w-28 bg-red-500 text-white py-2 rounded-md shadow-md text-sm 
                                    hover:transform hover:scale-105 transition-all duration-500'>
                                    {deleteLoader === user._id ?(
                                        <BeatLoader cssOverride={overrideStyle} size={10} color='white'/>
                                    ) : (
                                        'Delete User'
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-center text-gray-500 dark:text-gray-300'>No users found</p>
                )}
            </div>
        </div>
    );
};

export default ManageUser;