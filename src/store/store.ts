// src/store/store.ts
import { configureStore, Dispatch, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './slices/authSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // business : businessReducer, // Assuming you have a businessReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

function setupListeners(dispatch: ThunkDispatch<{ auth: AuthState; }, undefined, UnknownAction> & Dispatch<UnknownAction>) {
  throw new Error('Function not implemented.');
}

