import { skipToken } from '@reduxjs/toolkit/dist/query'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { api } from './api'
import { RootState } from './reducer'
import { AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useGetUserQuery = () => {
  const location = useLocation()
  const hasSessionEnded = useAppSelector((state) => state.sessionSlice.hasSessionEnded)
  const isErrorPage = location.pathname.startsWith('/error')

  return api.useGetUserQuery(hasSessionEnded || isErrorPage ? skipToken : undefined)
}
