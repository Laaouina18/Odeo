import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../api/axios';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  role: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: { 'Content-Type': 'application/json' }
    });
    return {
      user: response.user,
      token: response.token,
      role: response.user.role || response.role,
    };
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Erreur de connexion');
  }
});

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const response = await apiFetch('/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
  
    return {
      user: response.user,
      agency: response.agency,
      token: response.token,
      role: response.user.role || response.role,
    };
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Erreur d\'inscription');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.clear();
    
    },
    setUser(state, action) {
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isAuthenticated = true;
  state.role = action.payload.role;
  
  localStorage.setItem('user', JSON.stringify(action.payload.user));
  localStorage.setItem('agency', JSON.stringify(action.payload.agency));
  localStorage.setItem('agency_id', action.payload.agency.id);
  localStorage.setItem('token', action.payload.token);
  localStorage.setItem('role', action.payload.role);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.role);
        localStorage.setItem('agency_id', action.payload.agency?.id || null);
          localStorage.setItem('agency', JSON.stringify(action.payload.agency));
  // agency_id should only be set after fetching/creating agency profile, not from user.id
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Erreur de connexion';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.role);
        localStorage.setItem('agency_id', action.payload.agency?.id || null);
          localStorage.setItem('agency', JSON.stringify(action.payload.agency))
  // agency_id should only be set after fetching/creating agency profile, not from user.id
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Erreur d\'inscription';
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
