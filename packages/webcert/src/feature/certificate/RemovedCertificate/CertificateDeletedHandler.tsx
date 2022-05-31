import React from 'react'
import { useHistory } from 'react-router-dom'
import RemovedCertificate from './RemovedCertificate'
import {
  updateIsDeleted,
  updateRoutedFromDeletedCertificate,
  updateShouldRouteAfterDelete,
} from '../../../store/certificate/certificateActions'
import { useDispatch, useSelector } from 'react-redux'
import { getShouldRouteAfterDelete } from '../../../store/certificate/certificateSelectors'

const CertificateDeletedHandler: React.FC = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const shouldRouteAfterDelete = useSelector(getShouldRouteAfterDelete())

  const getDeletedComponent = () => {
    if (shouldRouteAfterDelete) {
      dispatch(updateRoutedFromDeletedCertificate(true))
      dispatch(updateShouldRouteAfterDelete(false))
      dispatch(updateIsDeleted(false))
      history.goBack()
    }

    return <RemovedCertificate />
  }

  return getDeletedComponent()
}

export default CertificateDeletedHandler
