import { skipToken } from '@reduxjs/toolkit/dist/query'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { api } from './api'
import { AppDispatch, RootState } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useGetUserQuery = () => {
  const hasSessionEnded = useAppSelector((state) => state.sessionSlice.hasSessionEnded)
  return api.useGetUserQuery(hasSessionEnded ? skipToken : undefined)
}
