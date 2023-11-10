import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import { errorMiddleware } from './middleware/error.middleware'
import { sessionMiddleware } from './middleware/session.middleware'
import { certificateFilterReducer, certificateFilterReducerPath } from './slice/certificateFilter.slice'
import { sessionReducer, sessionReducerPath } from './slice/session.slice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [certificateFilterReducerPath]: certificateFilterReducer,
    [sessionReducerPath]: sessionReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([api.middleware, sessionMiddleware, errorMiddleware]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
