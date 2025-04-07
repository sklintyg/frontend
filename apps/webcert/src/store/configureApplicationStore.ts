import { configureStore } from '@reduxjs/toolkit'
import { createBrowserHistory } from 'history'
import type { Middleware } from 'redux'
import { reducer } from './reducer'

export const history = createBrowserHistory()

export const configureApplicationStore = (middleware: Middleware[]) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
  })
