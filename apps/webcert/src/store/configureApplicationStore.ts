import { configureStore } from '@reduxjs/toolkit'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import type { Middleware } from 'redux'
import createRootReducer from './reducers'

export const history = createBrowserHistory()

export const configureApplicationStore = (middleware: Middleware[]) =>
  configureStore({
    reducer: createRootReducer(history),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(middleware).prepend(routerMiddleware(history)),
  })
