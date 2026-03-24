import React from 'react';
import { BeatLoader } from 'react-spinners';
import TiptapEditor from './TiptapEditor';

const CreateArea = ({ input, handleChange, setInput, submitHandler, isExpanded, setIsExpanded, loader }) => {
    const expand = () => setIsExpanded(true);

    return (
        <div className="font-montserrat px-4">
            <form
                onSubmit={submitHandler}
                className="w-full sm:w-[520px] mt-8 mb-6 mx-auto bg-surface-raised dark:bg-dark-raised rounded-card shadow-card border border-border dark:border-dark-border p-4 box-border transition-colors duration-200"
            >
                {isExpanded && (
                    <input
                        className="w-full bg-transparent border-b border-transparent focus:border-border dark:focus:border-dark-border outline-none px-0 pb-2 mb-3 text-subheading font-semibold text-ink dark:text-ink-inverse placeholder:text-ink-secondary/50 dark:placeholder:text-ink-inverse/40 transition-colors duration-150"
                        onChange={handleChange}
                        name="title"
                        value={input.title}
                        placeholder="Title"
                        type="text"
                    />
                )}

                <div onClick={expand}>
                    <TiptapEditor
                        content={input.content}
                        onChange={(html) => setInput({ ...input, content: html })}
                    />
                </div>

                {isExpanded && (
                    <div className="mt-3 flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-btn-x py-btn-y bg-accent hover:bg-accent-hover active:scale-95 text-accent-fg text-sm font-semibold rounded-button shadow-sm transition-all duration-150 cursor-pointer"
                        >
                            {loader ? (
                                <BeatLoader size={5} color="#1A1714" />
                            ) : (
                                'Add note'
                            )}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateArea;