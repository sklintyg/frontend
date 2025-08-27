import { configureStore } from '@reduxjs/toolkit'
import type { Middleware } from 'redux'
import { reducer } from './reducer'

// TODO: Remove this and always use the same preconfigured store in tests.
export const configureApplicationStore = (middleware: Middleware[]) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(middleware),
  })
