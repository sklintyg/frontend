import listImage from '@frontend/common/src/images/list.svg'
import noDraftsImage from '@frontend/common/src/images/no-drafts-image.svg'
import { ListFilterType, ListType } from '@frontend/common/src/types/list'
import React, { ComponentProps, useCallback, useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import CertificateList from '../components/certificateList/CertificateList'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import PatientInfoHeader from '../components/patient/PatientInfoHeader'
import ListContainer from '../feature/list/ListContainer'
import { isFilterDefault } from '../feature/list/listUtils'
import { resetCertificateState, updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import { performListSearch, updateActiveListFilterValue } from '../store/list/listActions'
import { getActiveListConfig, getActiveListFilter, getActiveListFilterValue, getListTotalCount } from '../store/list/listSelectors'
import { clearPatient, getPatient } from '../store/patient/patientActions'
import { getActivePatient } from '../store/patient/patientSelectors'
import { getUser } from '../store/user/userSelectors'
import { ResourceAccess } from '../utils/ResourceAccess'

interface Params {
  patientId: string
}

/**
 * Certificate page for a specific patient.
 */
const CreatePage: React.FC = () => {
  const { patientId } = useParams<Params>()
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig, shallowEqual)
  const totalCount = useSelector(getListTotalCount)
  const filter = useSelector(getActiveListFilter, shallowEqual)
  const patient = useSelector(getActivePatient)
  const user = useSelector(getUser)
  const patientFilter = useSelector(getActiveListFilterValue('PATIENT_ID'))
  const history = useHistory()

  useEffect(() => {
    dispatch(updateShouldRouteAfterDelete(true))
    dispatch(resetCertificateState())
  })

  const isPatientLoaded = () => {
    return !patientId || (patientId && patient)
  }

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
  }, [dispatch, patient])

  useEffect(() => {
    ReactTooltip.hide()
    updatePatientFilter()
    dispatch(performListSearch)
  }, [dispatch, updatePatientFilter])

  useEffect(() => {
    if (!patientFilter) {
      updatePatientFilter()
    }
  }, [patientFilter, updatePatientFilter])

  useEffect(() => {
    if (patientId) {
      dispatch(getPatient(patientId))
    }
  }, [dispatch, patientId])

  if (patient && !patientId) {
    history.push(`/create/${patient.personId.id}`)
  }

  if (history.action === 'POP') {
    dispatch(clearPatient())
    history.push('/search')
  }

  return (
    <>
      {user && (
        <CommonLayout header={<WebcertHeader />} subHeader={patient && <PatientInfoHeader patient={patient} />}>
          {isPatientLoaded() && patient && (
            <>
              <CertificateList />
              <div className="iu-mt-800">
                <ListContainer
                  type={ListType.PREVIOUS_CERTIFICATES}
                  showMessageForEmptyList={isFilterDefault(config?.filters, filter?.values) && totalCount === 0}
                  icon={listImage}
                  emptyListIcon={noDraftsImage}
                />
              </div>
            </>
          )}
        </CommonLayout>
      )}
    </>
  )
}
export const CreatePageWithRedirect: React.FC<ComponentProps<typeof CreatePage>> = (props) => (
  <ResourceAccess>
    <CreatePage {...props} />
  </ResourceAccess>
)
