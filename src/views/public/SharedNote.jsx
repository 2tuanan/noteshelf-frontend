import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import api from '../../api/api';

// Tag palette — mirrors Note.jsx
const tagColors = [
    'bg-tag-blue   text-tag-blue-text   dark:bg-blue-900/30  dark:text-blue-300',
    'bg-tag-green  text-tag-green-text  dark:bg-green-900/30 dark:text-green-300',
    'bg-tag-purple text-tag-purple-text dark:bg-purple-900/30 dark:text-purple-300',
    'bg-tag-amber  text-tag-amber-text  dark:bg-yellow-900/30 dark:text-yellow-300',
    'bg-tag-pink   text-tag-pink-text   dark:bg-pink-900/30  dark:text-pink-300',
];

const SparkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        className="w-3.5 h-3.5" aria-hidden="true">
        <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192z" />
        <path d="M6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.683a1 1 0 0 1 .633.633l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684z" />
    </svg>
);

// Loading skeleton — preserves layout while fetching
const Skeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-7 bg-border dark:bg-dark-inset rounded-button w-3/4" />
        <div className="h-3.5 bg-border-subtle dark:bg-dark-inset rounded-button w-1/4" />
        <div className="space-y-2 mt-6">
            <div className="h-3.5 bg-border-subtle dark:bg-dark-inset rounded-button w-full" />
            <div className="h-3.5 bg-border-subtle dark:bg-dark-inset rounded-button w-5/6" />
            <div className="h-3.5 bg-border-subtle dark:bg-dark-inset rounded-button w-full" />
            <div className="h-3.5 bg-border-subtle dark:bg-dark-inset rounded-button w-4/5" />
            <div className="h-3.5 bg-border-subtle dark:bg-dark-inset rounded-button w-full" />
            <div className="h-3.5 bg-border-subtle dark:bg-dark-inset rounded-button w-2/3" />
        </div>
    </div>
);

const SharedNote = () => {
    const { shareToken } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Standalone page — apply dark mode from OS preference.
    // (No MainLayout / Redux here — this is a public route.)
    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        api.get(`/public/note/${shareToken}`)
            .then((res) => setNote(res.data.note))
            .catch(() => setError('This note is no longer available.'))
            .finally(() => setLoading(false));
    }, [shareToken]);

    const isHtml = note &&
        (note.contentType === 'html' || note.content?.trim().startsWith('<'));

    return (
        <div className="min-h-screen bg-surface dark:bg-dark transition-colors duration-200
            font-montserrat">

            {/* ── Centered reading column ── */}
            <div className="max-w-2xl mx-auto px-4 sm:px-8 py-12 sm:py-16">

                {loading && (
                    <div className="bg-surface-raised dark:bg-dark-raised
                        border border-border dark:border-dark-border
                        rounded-card shadow-card
                        px-card-x py-card-y sm:p-8">
                        <Skeleton />
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-24 space-y-3">
                        <span className="flex items-center justify-center w-14 h-14 rounded-panel
                            bg-accent-subtle text-accent mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor" className="w-7 h-7" aria-hidden="true">
                                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <p className="text-subheading font-semibold text-ink dark:text-ink-inverse">
                            Note unavailable
                        </p>
                        <p className="text-body text-ink-secondary dark:text-ink-inverse-secondary">
                            {error}
                        </p>
                    </div>
                )}

                {!loading && note && (
                    <>
                        {/* Note card */}
                        <article className="bg-surface-raised dark:bg-dark-raised
                            border border-border dark:border-dark-border
                            rounded-card shadow-card
                            px-card-x py-card-y sm:p-8">

                            {/* Title */}
                            <h1 className="text-heading font-semibold
                                text-ink dark:text-ink-inverse
                                mb-2 leading-snug break-words">
                                {note.title}
                            </h1>

                            {/* Shared date */}
                            <p className="text-caption text-ink-tertiary dark:text-ink-inverse-tertiary
                                mb-6">
                                Shared {new Date(note.sharedAt).toLocaleDateString(undefined, {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                })}
                            </p>

                            {/* Divider */}
                            <div className="border-t border-border-subtle dark:border-dark-border-subtle mb-6" />

                            {/* Content */}
                            {isHtml ? (
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none
                                        text-ink dark:text-ink-inverse"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(note.content)
                                    }}
                                />
                            ) : (
                                <p className="text-body text-ink-secondary dark:text-ink-inverse-secondary
                                    whitespace-pre-wrap break-words leading-relaxed">
                                    {note.content}
                                </p>
                            )}

                            {/* Tags */}
                            {note.tags && note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-6">
                                    {note.tags.map((tag, i) => (
                                        <span
                                            key={tag}
                                            className={`text-caption px-2 py-0.5 rounded-badge
                                                font-medium ${tagColors[i % tagColors.length]}`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </article>

                        {/* Branding footer — subtle portfolio touch */}
                        <div className="mt-8 flex items-center justify-center gap-1.5
                            text-caption text-ink-tertiary dark:text-ink-inverse-tertiary">
                            <span className="text-accent"><SparkIcon /></span>
                            <span>Made with{' '}
                                <span
                                    className="font-medium text-accent"
                                    style={{ fontFamily: 'McLaren, cursive' }}
                                >
                                    Noteshelf
                                </span>
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SharedNote;
