import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { user_login, messageClear, get_user_info } from '../../store/Reducers/authReducer';
import { BeatLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {loader, errorMessage, successMessage, role} = useSelector(state => state.auth)

    const [state, setState] = useState({
        email: '',
        password: ''
    })

    const inputHandler = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(user_login(state))
        // console.log(state)
    }
    useEffect(() => {
        if (errorMessage){
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage){
            toast.success(successMessage)
            dispatch(messageClear())
            dispatch(get_user_info())
        }
    }, [errorMessage, successMessage, dispatch])

    useEffect(() => {
        if (role === 'user') {
            navigate('/user')
        }
        if (role === 'admin') {
            navigate('/admin')
        }
    }, [role])

    const overrideStyle = {
        display: 'flex',
        margin: '0 auto',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
    }

    return (
        <div className='min-w-screen min-h-screen font-montserrat px-4 bg-gray-100 flex flex-col justify-center items-center'>
            <div className='flex-col justify-center items-center'>
                <div className='mb-10 p-4'>
                    <h2 className='text-center text-2xl font-semibold text-yellow-500 mb-5'>Welcome to Noteshelf</h2>
                </div>
                <div className='w-full max-w-sm bg-white p-6 rounded-lg shadow-lg'>
                    <h3 className='text-center text-xl font-medium text-yellow-500 mb-8'>Sign In</h3>
                    <form onSubmit={submitHandler}>
                        <div className='flex flex-row w-full gap-4 justify-center items-center mb-3 text-gray-600'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 14 12" fill="none">
                                <path d="M7.42284 7.20313C7.2933 7.27452 7.1478 7.31196 6.99989 7.31196C6.85198 7.31196 6.70648 7.27452 6.57694 7.20313L0.4375 3.81622V10.1563C0.437847 10.5042 0.57624 10.8379 0.822306 11.0839C1.06837 11.33 1.40201 11.4684 1.75 11.4688H12.25C12.598 11.4684 12.9316 11.33 13.1777 11.0839C13.4238 10.8379 13.5622 10.5042 13.5625 10.1563V3.81622L7.42284 7.20313Z" fill="#ADB5BD"/>
                                <path d="M12.2505 0.53125H1.75049C1.4025 0.531597 1.06886 0.66999 0.822794 0.916056C0.576728 1.16212 0.438336 1.49576 0.437988 1.84375V2.9375C0.437973 2.97664 0.448459 3.01506 0.468351 3.04877C0.488243 3.08247 0.516813 3.11022 0.551082 3.12912L6.89483 6.62912C6.92719 6.64697 6.96354 6.65633 7.00049 6.65633C7.03744 6.65633 7.07379 6.64697 7.10614 6.62912L13.4499 3.12912C13.4842 3.11022 13.5127 3.08247 13.5326 3.04877C13.5525 3.01506 13.563 2.97664 13.563 2.9375V1.84375C13.5626 1.49576 13.4242 1.16212 13.1782 0.916056C12.9321 0.66999 12.5985 0.531597 12.2505 0.53125Z" fill="#ADB5BD"/>
                            </svg>
                            <input onChange={inputHandler} value={state.email} className='px-3 py-2 outline-none border border-gray-500 bg-transparent rounded-md focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400' 
                            type="email" name='email' placeholder='Email' id='email' required/>
                        </div>
                        <div className='flex flex-row w-full gap-4 justify-center items-center mb-6'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 10 14" fill="none">
                                <path d="M5 5.03131C2.58369 5.03131 0.625 6.99 0.625 9.40631C0.625 11.8226 2.58369 13.7813 5 13.7813C7.41631 13.7813 9.375 11.8226 9.375 9.40631C9.375 6.99 7.41631 5.03131 5 5.03131ZM5.21875 10.0429V11.3751H4.78125V10.0429C4.16066 9.93853 3.6875 9.40019 3.6875 8.75006C3.6875 8.02512 4.27506 7.43756 5 7.43756C5.72494 7.43756 6.3125 8.02512 6.3125 8.75006C6.3125 9.40019 5.83934 9.93853 5.21875 10.0429Z" fill="#ADB5BD"/>
                                <path d="M2.59424 5.24125V3.0625C2.59424 1.73578 3.67377 0.65625 5.00049 0.65625C6.32721 0.65625 7.40674 1.73578 7.40674 3.0625H7.84424C7.84424 1.4945 6.56849 0.21875 5.00049 0.21875C3.43249 0.21875 2.15674 1.4945 2.15674 3.0625V5.52694C2.29696 5.42391 2.44308 5.32875 2.59424 5.24125Z" fill="#ADB5BD"/>
                            </svg>
                            <input onChange={inputHandler} value={state.password} className='px-3 py-2 outline-none border border-gray-500 bg-transparent rounded-md focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400' 
                            type="password" name='password' placeholder='Password' id='password' required/>
                        </div>
                        <button disabled={loader ? true : false} className='flex min-h-10 w-24 justify-center items-center m-auto bg-yellow-400 text-white rounded-md py-2 px-3 hover:shadow-md hover:scale-105 transform duration-500'>
                            {
                                loader ? <BeatLoader cssOverride={overrideStyle} size={12} color='white'/> : 'Sign In'
                            }
                        </button>
                    </form>
                    <div className='text-center text-sm text-gray-500 mt-5'>
                        <p>Don't have an account?</p>
                        <p className='text-yellow-500 font-medium hover:underline'><Link to="/register">Create new account</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;