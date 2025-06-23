import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  businesses: [
    {
      id: 1,
      name: 'Sample Business',
      type: 'Retail',
      address: '123 Main St',
      contact: '555-0123',
    }
  ],
  loading: false,
  error: null,
};

const businessSlice = createSlice({
  name: 'businesses',
  initialState,
  reducers: {
    setBusinesses: (state, action) => {
      state.businesses = action.payload;
    },
    addBusiness: (state, action) => {
      state.businesses.push(action.payload);
    },
    updateBusiness: (state, action) => {
      const index = state.businesses.findIndex(business => business.id === action.payload.id);
      if (index !== -1) {
        state.businesses[index] = action.payload;
      }
    },
    deleteBusiness: (state, action) => {
      state.businesses = state.businesses.filter(business => business.id !== action.payload);
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
  setBusinesses,
  addBusiness,
  updateBusiness,
  deleteBusiness,
  setLoading,
  setError,
} = businessSlice.actions;

export default businessSlice.reducer; 