import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import {
  deleteCertificate,
  updateIsDeleted,
  updateRoutedFromDeletedCertificate,
  updateShouldRouteAfterDelete,
} from '../../../store/certificate/certificateActions'
import { getShouldRouteAfterDelete } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'

export function useDeleteCertificate(certificateId: string) {
  const history = useHistory()
  const dispatch = useAppDispatch()
  const shouldRouteAfterDelete = useSelector(getShouldRouteAfterDelete())

  return () => {
    dispatch(deleteCertificate({ certificateId }))

    if (shouldRouteAfterDelete) {
      dispatch(updateRoutedFromDeletedCertificate(true))
      dispatch(updateShouldRouteAfterDelete(false))
      dispatch(updateIsDeleted(false))
      history.goBack()
    }
  }
}
