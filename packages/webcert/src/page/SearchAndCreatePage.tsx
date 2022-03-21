import React, { useEffect } from 'react'
import PatientSearch from '../components/patient/PatientSearch'
import WebcertHeader from '../components/header/WebcertHeader'
import { useDispatch, useSelector } from 'react-redux'
import PatientInfoHeader from '../components/patient/PatientInfoHeader'
import { getActivePatient } from '../store/patient/patientSelectors'
import { useHistory, useParams } from 'react-router-dom'
import { getPatient } from '../store/patient/patientActions'
import { CustomTooltip, resourceLinksAreEqual, ResourceLinkType } from '@frontend/common'
import { getUser, getUserResourceLinks } from '../store/user/userSelectors'
import ReactTooltip from 'react-tooltip'

interface Params {
  patientId: string
}

const SearchAndCreatePage: React.FC = () => {
  const { patientId } = useParams<Params>()
  const dispatch = useDispatch()
  const patient = useSelector(getActivePatient)
  const history = useHistory()
  const user = useSelector(getUser)
  const userLinks = useSelector(getUserResourceLinks)

  const isPatientLoaded = () => {
    return !patientId || (patientId && patient)
  }

  useEffect(() => {
    ReactTooltip.hide()
  }, [patient])

  useEffect(() => {
    if (!user || !userLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE))) {
      history.push('#')
    }
  }, [user, userLinks])

  useEffect(() => {
    if (patientId) {
      dispatch(getPatient({ patientId: patientId, history: history }))
    }
  }, [history, dispatch, patientId])

  return (
    <>
      {user && (
        <>
          <WebcertHeader />
          <CustomTooltip />
          {isPatientLoaded() && <>{patient ? <PatientInfoHeader patient={patient} /> : <PatientSearch />}</>}
        </>
      )}
    </>
  )
}
export default SearchAndCreatePage
