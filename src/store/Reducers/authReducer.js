import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';
import  { jwtDecode } from 'jwt-decode';

export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async(info, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.post('/admin-login', info, {withCredentials: true})
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data);
        } catch (error) {
            console.error('admin_login error:', error);
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
            localStorage.setItem('accessToken', data.token)
            // console.log(data);
            return fulfillWithValue(data);
        } catch (error) {
            console.error('user_login error:', error);
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
            console.error('get_user_info error:', error);
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
            console.log('Register success:', data);
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data);
        } catch (error) {
            console.error('Register error:', error);
            const err = error.response?.data || {error: error.message || 'An error occurred'};
            return rejectWithValue(err);
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async({navigate, role}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/logout', {withCredentials: true})
            localStorage.removeItem('accessToken', data.token);
            if (role === 'admin') navigate('/admin/login')
            else navigate('/login')
            return fulfillWithValue(data);
        } catch (error) {
            console.error('logout error:', error);
            const err = error.response?.data || {error: error.message || 'An error occurred'};
            return rejectWithValue(err);
            
        }
    }
)

const returnRole = (token) => {
    if (token) {
        const decoded = jwtDecode(token);
        const expireTime = new Date(decoded.exp * 1000);
        if (new Date() > expireTime) {
            localStorage.removeItem('accessToken');
            return '';
        } else {
            return decoded.role;
        }
    } else {
        return '';
    }
}

export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        userInfo: '',
        role: returnRole(localStorage.getItem('accessToken')),
        token: localStorage.getItem('accessToken')
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
            state.token = payload.token
            state.role = returnRole(payload.token)
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
            state.token = payload.token
            state.role = returnRole(payload.token)
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
            state.token = payload.token
            state.role = returnRole(payload.token)
        })
        .addCase(get_user_info.fulfilled, (state, {payload}) => {
            state.loader = false;
            state.userInfo = payload.userInfo
        })
    }
})

export const {messageClear} = authReducer.actions;
export default authReducer.reducer;