import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roles: [
    {
      id: 1,
      name: 'Admin',
      description: 'Administrator with full access',
    }
  ],
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    addRole: (state, action) => {
      state.roles.push(action.payload);
    },
    updateRole: (state, action) => {
      const index = state.roles.findIndex(role => role.id === action.payload.id);
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
    },
    deleteRole: (state, action) => {
      state.roles = state.roles.filter(role => role.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRoles,
  addRole,
  updateRole,
  deleteRole,
  setLoading,
  setError,
} = roleSlice.actions;

export default roleSlice.reducer; 