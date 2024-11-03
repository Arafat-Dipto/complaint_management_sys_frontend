import { createSlice } from '@reduxjs/toolkit';

// Initial state for auth
const initialState = {
  token: null,
  isAuthenticated: false,
};

// Create auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.privilege = null;
    },
    setPrivilege: (state, action) => {
      state.privilege = action.payload;
    }
  },
});

// Export actions
export const { setToken,setAuthUser, logout, setPrivilege } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
