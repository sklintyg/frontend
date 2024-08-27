import { skipToken } from '@reduxjs/toolkit/query'
import type { TypedUseSelectorHook } from 'react-redux'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import type { AvailableFunctionsType } from '../schema/certificate.schema'
import { api } from './api'
import type { RootState } from './reducer'
import type { AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export function useGetUserQuery() {
  const location = useLocation()
  const hasSessionEnded = useAppSelector((state) => state.sessionSlice.hasSessionEnded)
  const isErrorPage = location.pathname.startsWith('/error')

  return api.useGetUserQuery(hasSessionEnded || isErrorPage ? skipToken : undefined)
}

export function useAvailableFunction(id: string, type: AvailableFunctionsType) {
  return useAppSelector((state) => {
    const certificate = api.endpoints.getCertificate.select({ id })(state).data
    return (certificate?.availableFunctions ?? []).find((fn) => fn.type === type)
  }, shallowEqual)
}
