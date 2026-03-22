import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_note = createAsyncThunk(
    'note/add_note',
    async(note, {rejectWithValue, }) => {
        try {
            const {data} = await api.post('/add-note', note, {withCredentials: true})
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const get_notes = createAsyncThunk(
    'note/get_notes',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/get-notes', {withCredentials: true})
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const delete_note = createAsyncThunk(
    'note/delete_note',
    async(id, {rejectWithValue, }) => {
        try {
            const response = await api.delete(`/delete-note/${id}`, {withCredentials: true})
            return {message: response.data.message, id};
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const update_note = createAsyncThunk(
    'note/update_note',
    async({ id, data }, {rejectWithValue, }) => {
        try {
            const {data: res} = await api.put(`/update-note/${id}`, data, {withCredentials: true})
            return { ...res, id };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const noteReducer = createSlice({
    name: 'note',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        notes: [],
        totalNotes: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = '';
            state.successMessage = '';
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(add_note.pending, (state) => {
            state.loader = true;
        })
        .addCase(add_note.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            if (payload.note) state.notes.push(payload.note);
        })
        .addCase(add_note.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
        })
        .addCase(get_notes.fulfilled, (state, { payload }) => {
            state.notes = payload.notes;
            state.totalNotes = payload.totalNotes;
        })
        .addCase(delete_note.rejected, (state, { payload }) => {
            state.errorMessage = payload.error;
        })
        .addCase(delete_note.fulfilled, (state, { payload }) => {
            state.notes = state.notes.filter(note => note._id !== payload.id);
            state.successMessage = payload.message;
        })
        .addCase(update_note.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message;
            const index = state.notes.findIndex(note => note._id === payload.id);
            if (index !== -1) state.notes[index] = payload.note;
        })
        .addCase(update_note.rejected, (state, { payload }) => {
            state.errorMessage = payload?.error || 'Update failed';
        })
    }
})

export const {messageClear} = noteReducer.actions;
export default noteReducer.reducer;