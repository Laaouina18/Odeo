import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  notifications: [],
  modals: {},
  sidebar: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showNotification(state, action) {
      state.notifications.push(action.payload);
    },
    toggleModal(state, action) {
      state.modals[action.payload] = !state.modals[action.payload];
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    toggleSidebar(state) {
      state.sidebar = !state.sidebar;
    },
  },
});

export const { showNotification, toggleModal, setLoading, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
