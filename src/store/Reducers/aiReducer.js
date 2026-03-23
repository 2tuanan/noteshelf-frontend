import { createSlice } from "@reduxjs/toolkit";

const aiSlice = createSlice({
    name: 'ai',
    initialState: {
        chatMessages: [],
        chatStreaming: false,
        chatNoteId: null,
        streamingContent: ''
    },
    reducers: {
        addUserMessage: (state, { payload }) => {
            state.chatMessages.push({ role: 'user', content: payload });
            state.chatStreaming = true;
            state.streamingContent = '';
        },
        appendStreamToken: (state, { payload }) => {
            state.streamingContent += payload;
        },
        finalizeAssistantMessage: (state) => {
            state.chatMessages.push({ role: 'assistant', content: state.streamingContent });
            state.streamingContent = '';
            state.chatStreaming = false;
        },
        setChatNoteId: (state, { payload }) => {
            if (state.chatNoteId !== payload) {
                state.chatMessages = [];
                state.chatNoteId = payload;
            }
        }
    }
});

export const {
    addUserMessage,
    appendStreamToken,
    finalizeAssistantMessage,
    setChatNoteId
} = aiSlice.actions;

export default aiSlice.reducer;
