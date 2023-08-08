import { useAppDispatch } from '../store/hooks'
import { resetSickLeaveFilters } from '../store/slices/sickLeave.slice'
import { resetLUFilters } from '../store/slices/luCertificates.slice'

export function useResetFilters() {
  const dispatch = useAppDispatch()
  return {
    resetFilters: () => {
      dispatch(resetSickLeaveFilters())
      dispatch(resetLUFilters())
    },
  }
}
