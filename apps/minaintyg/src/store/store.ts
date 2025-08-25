import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import { errorMiddleware } from './middleware/error.middleware'
import { sessionMiddleware } from './middleware/session.middleware'
import { reducer } from './reducer'

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([api.middleware, sessionMiddleware, errorMiddleware]),
})

export type AppDispatch = typeof store.dispatch
