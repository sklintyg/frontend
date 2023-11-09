import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import { errorMiddleware } from './errorMiddleware'
import { certificateFilterReducer, certificateFilterReducerPath } from './slice/certificateFilter.slice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [certificateFilterReducerPath]: certificateFilterReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([api.middleware, errorMiddleware]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
