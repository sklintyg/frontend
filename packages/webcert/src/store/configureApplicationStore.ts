import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './reducers'
import { Middleware } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

export const history = createBrowserHistory()

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const configureApplicationStore = (middleware: Middleware[]) =>
  configureStore({
    reducer: createRootReducer(history),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(middleware)
        .prepend(routerMiddleware(history)),
  })
