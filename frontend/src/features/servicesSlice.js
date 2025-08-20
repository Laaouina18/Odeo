import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  services: [],
  loading: false,
  filters: {},
  selectedService: null,
  error: null,
};

export const fetchServices = createAsyncThunk('services/fetchServices', async (filters) => {
  // Appel API à implémenter
});

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = action.payload;
    },
    selectService(state, action) {
      state.selectedService = action.payload;
    },
  },
  extraReducers: (builder) => {
    // À compléter avec fetchServices
  },
});

export const { setFilters, selectService } = servicesSlice.actions;
export default servicesSlice.reducer;
