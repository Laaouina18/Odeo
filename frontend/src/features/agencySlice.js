import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  agencyProfile: null,
  agencyServices: [],
  agencyBookings: [],
  stats: {},
  loading: false,
  error: null,
};

export const fetchAgencyData = createAsyncThunk('agency/fetchAgencyData', async () => {
  // Appel API à implémenter
});

export const fetchAgencyStats = createAsyncThunk('agency/fetchAgencyStats', async () => {
  // Appel API à implémenter
});

const agencySlice = createSlice({
  name: 'agency',
  initialState,
  reducers: {
    setAgencyProfile(state, action) {
      state.agencyProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    // À compléter avec fetchAgencyData/fetchAgencyStats
  },
});

export const { setAgencyProfile } = agencySlice.actions;
export default agencySlice.reducer;
