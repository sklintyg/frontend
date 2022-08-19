import React, { useEffect } from 'react'
import PatientSearch from '../components/patient/PatientSearch'
import WebcertHeader from '../components/header/WebcertHeader'
import { useDispatch, useSelector } from 'react-redux'
import PatientInfoHeader from '../components/patient/PatientInfoHeader'
import { getActivePatient } from '../store/patient/patientSelectors'
import { Redirect, useParams } from 'react-router-dom'
import { getPatient } from '../store/patient/patientActions'

import { getUser } from '../store/user/userSelectors'
import ReactTooltip from 'react-tooltip'
import { withResourceAccess } from '../utils/withResourceAccess'
import CertificateList from '../components/certificateList/CertificateList'
import ListPage from './ListPage'
import { ListFilterType, ListType } from '@frontend/common/src/types/list'
import { updateActiveListFilterValue } from '../store/list/listActions'
import { resetCertificateState, updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import CommonLayout from '../components/commonLayout/CommonLayout'
import { getActiveListFilterValue } from '../store/list/listSelectors'

interface Params {
  patientId: string
}

const SearchAndCreatePage: React.FC = () => {
  const { patientId } = useParams<Params>()
  const dispatch = useDispatch()
  const patient = useSelector(getActivePatient)
  const user = useSelector(getUser)
  const patientFilter = useSelector(getActiveListFilterValue('PATIENT_ID'))

  useEffect(() => {
    dispatch(updateShouldRouteAfterDelete(true))
    dispatch(resetCertificateState())
  })

  const isPatientLoaded = () => {
    return !patientId || (patientId && patient)
  }

  useEffect(() => {
    ReactTooltip.hide()
    updatePatientFilter()
  }, [dispatch, patient, updatePatientFilter])

  useEffect(() => {
    if (!patientFilter) {
      updatePatientFilter()
    }
  }, [patientFilter, updatePatientFilter])

  const updatePatientFilter = useCallback(() => {
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
  })

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
        <CommonLayout header={<WebcertHeader />} subHeader={patient && <PatientInfoHeader patient={patient} />}>
          {isPatientLoaded() && patient ? (
            <>
              <CertificateList />
              <div className="iu-mt-800">
                <ListPage type={ListType.PREVIOUS_CERTIFICATES} excludePageSpecificElements />
              </div>
            </>
          ) : (
            <PatientSearch />
          )}
        </CommonLayout>
      )}
    </>
  )
}
export const SearchAndCreatePageWithRedirect = withResourceAccess(SearchAndCreatePage)
