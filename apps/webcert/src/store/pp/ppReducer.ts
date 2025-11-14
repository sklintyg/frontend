import { combineReducers } from 'redux'
import { ppStep01Reducer, ppStep01ReducerName } from './ppStep01ReducerSlice'
import { ppStep02Reducer, ppStep02ReducerName } from './ppStep02ReducerSlice'
import { ppStep03Reducer, ppStep03ReducerName } from './ppStep03ReducerSlice'

export const ppReducerName = 'pp'
export const ppReducer = combineReducers({
  [ppStep01ReducerName]: ppStep01Reducer,
  [ppStep02ReducerName]: ppStep02Reducer,
  [ppStep03ReducerName]: ppStep03Reducer,
})
