import { configureStore } from '@reduxjs/toolkit'
import { hsaApi } from './hsaApi'

export const store = configureStore({
  reducer: {
    [hsaApi.reducerPath]: hsaApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(hsaApi.middleware),
})
