import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import developReducer from '../features/develop/developSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    develop: developReducer
  },
});
