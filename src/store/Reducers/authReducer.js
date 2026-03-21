import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async(info, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.post('/admin-login', info, {withCredentials: true})
            return fulfillWithValue(data);
        } catch (error) {
            // console.error('admin_login error:', error);
            const err = error.response?.data || {error: error.message || 'An error occurred'};
            return rejectWithValue(err);
        }
    }
)

export const user_login = createAsyncThunk(
    'auth/user_login',
    async(info, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.post('/user-login', info, {withCredentials: true})
            // console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.error('user_login error:', error);
            const err = error.response?.data || {error: error.message || 'An error occurred'};
            return rejectWithValue(err);
        }
    }
)

export const get_user_info = createAsyncThunk(
    'auth/get_user_info',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/get-user', {withCredentials: true})
            return fulfillWithValue(data);
        } catch (error) {
            // console.error('get_user_info error:', error);
            const err = error.response?.data || {error: error.message || 'An error occurred'};
            return rejectWithValue(err);
        }
    }
)

export const user_register = createAsyncThunk(
    'auth/user_register',
    async(info, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.post('/user-register', info, {withCredentials: true})
            // console.log('Register success:', data);
            return fulfillWithValue(data);
        } catch (error) {
            // console.error('Register error:', error);
            const err = error.response?.data || {error: error.message || 'An error occurred'};
            return rejectWithValue(err);
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/logout', {withCredentials: true})
            return fulfillWithValue(data);
        } catch (error) {
            // console.error('logout error:', error);
            const err = error.response?.data || {error: error.message || 'An error occurred'};
            return rejectWithValue(err);
            
        }
    }
)

export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        userInfo: '',
        role: '',
        token: ''
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(admin_login.pending, (state, {payload}) => {
            state.loader = true;
        })
        .addCase(admin_login.rejected, (state, {payload}) => {
            state.loader = false;
            state.errorMessage = payload?.error || 'An error occurred';
        })
        .addCase(admin_login.fulfilled, (state, {payload}) => {
            state.loader = false;
            state.successMessage = payload.message;
        })
        .addCase(user_login.pending, (state, {payload}) => {
            state.loader = true;
        })
        .addCase(user_login.rejected, (state, {payload}) => {
            state.loader = false;
            state.errorMessage = payload?.error || 'An error occurred';
        })
        .addCase(user_login.fulfilled, (state, {payload}) => {
            state.loader = false;
            state.successMessage = payload.message;
        })
        .addCase(user_register.pending, (state, {payload}) => {
            state.loader = true;
        })
        .addCase(user_register.rejected, (state, {payload}) => {
            state.loader = false;
            state.errorMessage = payload?.error || 'An error occurred';
        })
        .addCase(user_register.fulfilled, (state, {payload}) => {
            state.loader = false;
            state.successMessage = payload.message;
        })
        .addCase(get_user_info.fulfilled, (state, {payload}) => {
            state.loader = false;
            state.userInfo = payload.userInfo
            state.role = payload.userInfo?.role || ''
        })
        .addCase(logout.fulfilled, (state) => {
            state.token = '';
            state.role = '';
            state.userInfo = '';
        })
    }
})

export const {messageClear} = authReducer.actions;
export default authReducer.reducer;