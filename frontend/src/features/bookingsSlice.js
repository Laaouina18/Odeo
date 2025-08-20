import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
};

export const createBooking = createAsyncThunk('bookings/createBooking', async (data) => {
  // Appel API à implémenter
});

export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async () => {
  // Appel API à implémenter
});

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    selectBooking(state, action) {
      state.currentBooking = action.payload;
    },
  },
  extraReducers: (builder) => {
    // À compléter avec createBooking/fetchBookings
  },
});

export const { selectBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
