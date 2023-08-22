import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import { configApi } from './configApi'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [configApi.reducerPath]: configApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([api.middleware, configApi.middleware]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
