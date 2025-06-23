import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import roleReducer from './slices/roleSlice';
import businessReducer from './slices/businessSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    roles: roleReducer,
    businesses: businessReducer,
    ui: uiReducer,
  },
}); 