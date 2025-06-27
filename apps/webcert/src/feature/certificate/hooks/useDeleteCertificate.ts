import { useNavigate } from 'react-router-dom'
import {
  deleteCertificate,
  updateIsDeleted,
  updateRoutedFromDeletedCertificate,
  updateShouldRouteAfterDelete,
} from '../../../store/certificate/certificateActions'
import { getShouldRouteAfterDelete } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch, useAppSelector } from '../../../store/store'

export function useDeleteCertificate(certificateId: string) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const shouldRouteAfterDelete = useAppSelector(getShouldRouteAfterDelete())

  return () => {
    dispatch(deleteCertificate({ certificateId }))

    if (shouldRouteAfterDelete) {
      dispatch(updateRoutedFromDeletedCertificate(true))
      dispatch(updateShouldRouteAfterDelete(false))
      dispatch(updateIsDeleted(false))
      navigate(-1)
    }
  }
}
