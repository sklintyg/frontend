import React, { useEffect } from 'react'
import PatientSearch from '../components/patient/PatientSearch'
import WebcertHeader from '../components/header/WebcertHeader'
import { useDispatch, useSelector } from 'react-redux'
import PatientInfoHeader from '../components/patient/PatientInfoHeader'
import { getActivePatient } from '../store/patient/patientSelectors'
import { useHistory, useParams } from 'react-router-dom'
import { getPatient } from '../store/patient/patientActions'
import { CustomTooltip } from '@frontend/common'
import { getUser } from '../store/user/userSelectors'
import ReactTooltip from 'react-tooltip'
import { withResourceAccess } from '../components/utils/withResourceAccess'

interface Params {
  patientId: string
}

const SearchAndCreatePage: React.FC = () => {
  const { patientId } = useParams<Params>()
  const dispatch = useDispatch()
  const patient = useSelector(getActivePatient)
  const history = useHistory()
  const user = useSelector(getUser)

  const isPatientLoaded = () => {
    return !patientId || (patientId && patient)
  }

  useEffect(() => {
    ReactTooltip.hide()
  }, [patient])

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
export const SearchAndCreatePageWithRedirect = withResourceAccess(SearchAndCreatePage)
