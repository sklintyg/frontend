import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import { hsaApi } from './hsaApi'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [hsaApi.reducerPath]: hsaApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([api.middleware, hsaApi.middleware]),
})
