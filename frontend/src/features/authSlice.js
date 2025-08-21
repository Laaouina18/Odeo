import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../api/axios';
import { setUserStorage, clearUserStorage } from '../utils/storage';

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
      
      // Utiliser l'utilitaire pour nettoyer le storage
      clearUserStorage();
    },
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.role = action.payload.role;
      
      // Stocker selon le rôle
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', action.payload.role);
      
      if (action.payload.role === 'agency' && action.payload.agency) {
        localStorage.setItem('agency', JSON.stringify(action.payload.agency));
        localStorage.setItem('agency_id', action.payload.agency.id);
      } else if (action.payload.role === 'client') {
        localStorage.setItem('client_id', action.payload.user.id);
      }
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
        
        // Utiliser l'utilitaire pour stocker les données
        setUserStorage(action.payload);
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
        
        // Utiliser l'utilitaire pour stocker les données
        setUserStorage(action.payload);
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
