import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import { errorMiddleware } from './middleware/error.middleware'
import { reducer } from './reducer'
import { idpMiddleware } from './slice/idpMiddleware'

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([api.middleware, idpMiddleware, errorMiddleware]),
})

export type AppDispatch = typeof store.dispatch
