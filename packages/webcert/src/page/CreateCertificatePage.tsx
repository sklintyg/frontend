import React, { useState } from 'react'
import PatientSearch from '../components/patient/PatientSearch'
import { useDispatch } from 'react-redux'
import { getPatient } from '../store/patient/patientActions'
import WebcertHeader from '../components/header/WebcertHeader'

const CreateCertificatePage: React.FC = () => {
  const [patientId, setPatientId] = useState('')
  const dispatch = useDispatch()

  const onTextInputChange = (patientId: string) => {
    setPatientId(patientId)
  }

  const onSubmit = () => {
    dispatch(getPatient(patientId))
  }

  return (
    <>
      <WebcertHeader />
      <div className={'ic-container'}>
        <PatientSearch patientId={patientId} onChange={onTextInputChange} onSubmit={onSubmit} />
      </div>
    </>
  )
}
export default CreateCertificatePage
