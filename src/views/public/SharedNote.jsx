import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import api from '../../api/api';

const SharedNote = () => {
    const { shareToken } = useParams();
    const [note, setNote] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/public/note/${shareToken}`)
            .then((response) => setNote(response.data.note))
            .catch(() => setError('This note is no longer available.'));
    }, [shareToken]);

    if (error) {
        return <div className="p-8 text-center text-gray-500">{error}</div>;
    }

    if (!note) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
            <p className="text-xs text-gray-400 mb-6">
                Shared on {new Date(note.sharedAt).toLocaleDateString()}
            </p>
            {note.contentType === 'html' ? (
                <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content) }}
                />
            ) : (
                <pre className="whitespace-pre-wrap text-sm">{note.content}</pre>
            )}
        </div>
    );
};

export default SharedNote;
