import { configureStore } from '@reduxjs/toolkit'
import type { Middleware } from 'redux'
import { reducer } from './reducer'

export const configureApplicationStore = (middleware: Middleware[]) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(middleware),
  })
