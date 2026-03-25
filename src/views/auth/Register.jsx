import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { user_register, messageClear } from '../../store/Reducers/authReducer';
import { BeatLoader } from 'react-spinners';
import toast from 'react-hot-toast';

// DEV NOTE — BUG FIX APPLIED:
// Previously navigate('/') after registration. Corrected to navigate('/login')
// so users land on the sign-in page after creating an account.
// The register action does not auto-authenticate, so navigating to '/' would
// drop the user at the root without a session.

const SparkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.683a1 1 0 0 1 .633.633l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684z" />
    </svg>
);

const IconUser = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003z" />
    </svg>
);

const IconMail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3z" />
        <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839z" />
    </svg>
);

const IconLock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1zm3 8V5.5a3 3 0 1 0-6 0V9h6z" clipRule="evenodd" />
    </svg>
);

const InputField = ({ label, icon, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-caption font-medium text-ink-secondary dark:text-ink-inverse-secondary mb-1.5">
            {label}
        </label>
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary dark:text-ink-inverse-secondary pointer-events-none">
                {icon}
            </span>
            <input
                id={id}
                className="w-full pl-10 pr-3 py-2 rounded-input border border-border dark:border-dark-border
                    bg-surface-inset dark:bg-dark-inset
                    text-ink dark:text-ink-inverse
                    placeholder:text-ink-secondary/50 dark:placeholder:text-ink-inverse-secondary/40
                    outline-none focus:shadow-focus focus:border-accent/60
                    transition-shadow duration-150"
                {...props}
            />
        </div>
    </div>
);

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector((s) => s.auth);
    const [state, setState] = useState({ name: '', email: '', password: '' });

    const inputHandler = (e) => setState({ ...state, [e.target.name]: e.target.value });
    const submitHandler = (e) => { e.preventDefault(); dispatch(user_register(state)); };

    useEffect(() => {
        if (errorMessage) { toast.error(errorMessage); dispatch(messageClear()); }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/login'); // BUG FIX: was navigate('/') — redirects to login, not root
        }
    }, [errorMessage, successMessage, dispatch, navigate]);

    return (
        <div className="min-h-screen font-montserrat bg-surface dark:bg-dark transition-colors duration-200
            flex flex-col justify-center items-center px-4 py-12">

            {/* Brand wordmark */}
            <div className="flex items-center gap-2 mb-8 text-accent">
                <SparkIcon />
                <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'McLaren, cursive' }}>
                    Noteshelf
                </span>
            </div>

            {/* Auth card */}
            <div className="w-full max-w-sm bg-surface-raised dark:bg-dark-raised rounded-card shadow-elevated
                border border-border dark:border-dark-border px-8 py-8 transition-colors duration-200">

                <h1 className="text-subheading font-semibold text-ink dark:text-ink-inverse text-center mb-6">
                    Create your account
                </h1>

                <form onSubmit={submitHandler} className="flex flex-col gap-4">
                    <InputField
                        label="Name"
                        id="name"
                        icon={<IconUser />}
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={state.name}
                        onChange={inputHandler}
                        autoComplete="name"
                        required
                    />
                    <InputField
                        label="Email"
                        id="email"
                        icon={<IconMail />}
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={state.email}
                        onChange={inputHandler}
                        autoComplete="email"
                        required
                    />
                    <InputField
                        label="Password"
                        id="password"
                        icon={<IconLock />}
                        type="password"
                        name="password"
                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                        value={state.password}
                        onChange={inputHandler}
                        autoComplete="new-password"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loader}
                        aria-busy={loader}
                        className="mt-2 w-full flex justify-center items-center min-h-[42px]
                            bg-accent hover:bg-accent-hover active:bg-accent-pressed
                            text-accent-fg font-semibold rounded-button
                            transition-all duration-150
                            disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loader ? <BeatLoader size={6} color="#1A1714" /> : 'Create account'}
                    </button>
                </form>

                <p className="text-center text-caption text-ink-secondary dark:text-ink-inverse-secondary mt-6">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-accent font-medium underline underline-offset-2 hover:text-accent-hover transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;