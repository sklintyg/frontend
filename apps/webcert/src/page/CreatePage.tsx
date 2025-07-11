import { useCallback, useEffect } from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { CertificateList } from '../components/certificateList/CertificateList'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import PatientInfoHeader from '../components/patient/PatientInfoHeader'
import { ListContainer } from '../feature/list/ListContainer'
import { isFilterDefault } from '../feature/list/listUtils'
import { listImage, noDraftsImage } from '../images'
import { resetCertificateState, updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import { performListSearch, updateActiveListFilterValue } from '../store/list/listActions'
import { getActiveListConfig, getActiveListFilter, getActiveListFilterValue, getListTotalCount } from '../store/list/listSelectors'
import { getPatient } from '../store/patient/patientActions'
import { getActivePatient } from '../store/patient/patientSelectors'
import { useAppSelector } from '../store/store'
import { getUser } from '../store/user/userSelectors'
import { ListFilterType, ListType, ResourceLinkType } from '../types'
import { ResourceAccess } from '../utils/ResourceAccess'

/**
 * Certificate page for a specific patient.
 */
const CreatePage = () => {
  const { patientId } = useParams()
  const dispatch = useDispatch()
  const config = useAppSelector(getActiveListConfig, shallowEqual)
  const totalCount = useAppSelector(getListTotalCount)
  const filter = useAppSelector(getActiveListFilter, shallowEqual)
  const patient = useAppSelector(getActivePatient)
  const user = useAppSelector(getUser)
  const patientFilter = useAppSelector(getActiveListFilterValue('PATIENT_ID'))
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(resetCertificateState())
    dispatch(updateShouldRouteAfterDelete(true))
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
      const decodedPatientId = atob(decodeURIComponent(patientId))
      dispatch(getPatient(decodedPatientId))
    }
  }, [dispatch, patientId])

  if (patient && !patientId) {
    navigate(`/create/${encodeURIComponent(btoa(patient.personId.id))}`)
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
export const CreatePageWithRedirect = () => (
  <ResourceAccess linkType={ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE}>
    <CreatePage />
  </ResourceAccess>
)
