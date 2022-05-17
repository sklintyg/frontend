import React, { useEffect } from 'react'
import PatientSearch from '../components/patient/PatientSearch'
import WebcertHeader from '../components/header/WebcertHeader'
import { useDispatch, useSelector } from 'react-redux'
import PatientInfoHeader from '../components/patient/PatientInfoHeader'
import { getActivePatient } from '../store/patient/patientSelectors'
import { Redirect, useParams } from 'react-router-dom'
import { getPatient } from '../store/patient/patientActions'
import { CustomTooltip } from '@frontend/common'
import { getUser } from '../store/user/userSelectors'
import ReactTooltip from 'react-tooltip'
import { withResourceAccess } from '../utils/withResourceAccess'
import CertificateList from '../components/certificateList/CertificateList'
import ListPage from './ListPage'
import { ListFilterType, ListType } from '@frontend/common/src/types/list'
import { updateActiveListFilterValue } from '../store/list/listActions'
import { updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'

interface Params {
  patientId: string
}

const SearchAndCreatePage: React.FC = () => {
  const { patientId } = useParams<Params>()
  const dispatch = useDispatch()
  const patient = useSelector(getActivePatient)
  const user = useSelector(getUser)

  useEffect(() => {
    dispatch(updateShouldRouteAfterDelete(true))
  })

  const isPatientLoaded = () => {
    return !patientId || (patientId && patient)
  }

  useEffect(() => {
    ReactTooltip.hide()
    if (patient) {
      dispatch(
        updateActiveListFilterValue({
          filterValue: {
            type: ListFilterType.PERSON_ID,
            value: patient.personId.id,
          },
          id: 'PATIENT_ID',
        })
      )
    }
  }, [dispatch, patient])

  useEffect(() => {
    if (patientId) {
      dispatch(getPatient(patientId))
    }
  }, [dispatch, patientId])

  if (patient && !patientId) {
    return <Redirect to={`/create/${patient.personId.id}`} />
  }

  return (
    <>
      {user && (
        <>
          <WebcertHeader />
          {isPatientLoaded() && (
            <>
              {patient ? (
                <>
                  <PatientInfoHeader patient={patient} />
                  <CertificateList />
                  <ListPage type={ListType.PREVIOUS_CERTIFICATES} excludePageSpecificElements />
                </>
              ) : (
                <PatientSearch />
              )}
            </>
          )}
          <CustomTooltip placement="top" />
        </>
      )}
    </>
  )
}
export const SearchAndCreatePageWithRedirect = withResourceAccess(SearchAndCreatePage)
