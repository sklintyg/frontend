import { skipToken } from '@reduxjs/toolkit/query'
import { useGetInfoQuery } from '../store/api'
import { useAppSelector } from '../store/hooks'

export function useLinks() {
  const hasSession = useAppSelector((state) => state.sessionSlice.hasSession)
  const { data: info } = useGetInfoQuery(hasSession ? undefined : skipToken)

  return info?.links ?? []
}
