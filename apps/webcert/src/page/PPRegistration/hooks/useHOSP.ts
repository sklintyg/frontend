import { useGetHOSPInformationQuery } from '../../../store/pp/ppApi'

export function useHOSP() {
  const { data, isSuccess, isFetching, isLoading, isError } = useGetHOSPInformationQuery()

  const isMissing = isSuccess && !data?.personalPrescriptionCode && data?.specialities.length === 0 && data.specialities.length === 0
  return { data, isMissing, isSuccess, isFetching, isLoading, isError }
}
