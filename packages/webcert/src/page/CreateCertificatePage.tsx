import React, { useEffect } from 'react'
import PatientSearch from '../components/patient/PatientSearch'
import WebcertHeader from '../components/header/WebcertHeader'
import { useDispatch, useSelector } from 'react-redux'
import PatientInfoHeader from '../components/patient/PatientInfoHeader'
import { getActivePatient } from '../store/patient/patientSelectors'
import { useHistory, useParams } from 'react-router-dom'
import { getPatient } from '../store/patient/patientActions'
import { CustomTooltip } from '@frontend/common'

interface Params {
  patientId: string
}

const CreateCertificatePage: React.FC = () => {
  const { patientId } = useParams<Params>()
  const dispatch = useDispatch()
  const patient = useSelector(getActivePatient)
  const history = useHistory()

  const isPatientLoaded = () => {
    return !patientId || (patientId && patient)
  }

  useEffect(() => {
    if (patientId) {
      dispatch(getPatient({ patientId: patientId, history: history }))
    }
  }, [history, dispatch, patientId])

  return (
    <>
      <WebcertHeader />
      <CustomTooltip />
      {isPatientLoaded() && <>{patient ? <PatientInfoHeader patient={patient} /> : <PatientSearch />}</>}
    </>
  )
}
export default CreateCertificatePage
