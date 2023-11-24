import { combineReducers } from '@reduxjs/toolkit'
import { api } from './api'
import { certificateFilterReducer, certificateFilterReducerPath } from './slice/certificateFilter.slice'
import { sessionReducer, sessionReducerPath } from './slice/session.slice'

export const reducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [certificateFilterReducerPath]: certificateFilterReducer,
  [sessionReducerPath]: sessionReducer,
})

export type RootState = ReturnType<typeof reducer>
