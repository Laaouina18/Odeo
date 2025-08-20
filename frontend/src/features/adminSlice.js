import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  agencies: [],
  globalStats: {},
  analytics: {},
  transactions: [],
  loading: false,
  error: null,
};

export const fetchAgencies = createAsyncThunk('admin/fetchAgencies', async () => {
  // Appel API à implémenter
});

export const fetchAnalytics = createAsyncThunk('admin/fetchAnalytics', async () => {
  // Appel API à implémenter
});

export const fetchTransactions = createAsyncThunk('admin/fetchTransactions', async () => {
  // Appel API à implémenter
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // À compléter avec fetchAgencies/fetchAnalytics/fetchTransactions
  },
});

export default adminSlice.reducer;
