// src/store/store.ts
import { configureStore, UnknownAction } from '@reduxjs/toolkit';
// import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

function authReducer(state: unknown, action: UnknownAction): unknown {
  throw new Error('Function not implemented.');
}
