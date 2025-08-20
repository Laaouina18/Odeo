import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/authSlice';
import servicesReducer from '../features/servicesSlice';
import bookingsReducer from '../features/bookingsSlice';
import agencyReducer from '../features/agencySlice';
import adminReducer from '../features/adminSlice';
import uiReducer from '../features/uiSlice';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
  auth: authReducer,
  services: servicesReducer,
  bookings: bookingsReducer,
  agency: agencyReducer,
  admin: adminReducer,
  ui: uiReducer,
  counter: counterReducer,
  },
});
