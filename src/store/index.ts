import { configureStore } from '@reduxjs/toolkit';
import aiModuleReducer from './aiModuleSlice';

export const store = configureStore({
  reducer: {
    aiModule: aiModuleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 