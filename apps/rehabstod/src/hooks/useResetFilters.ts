import { useAppDispatch } from '../store/hooks'
import { reset as resetLUFilters } from '../store/slices/luCertificatesFilter.slice'
import { reset as resetSickLeaveFilters } from '../store/slices/sickLeaveFilter.slice'

export function useResetFilters() {
  const dispatch = useAppDispatch()
  return {
    resetFilters: () => {
      dispatch(resetSickLeaveFilters())
      dispatch(resetLUFilters())
    },
  }
}
