import React, { useState } from 'react'
import PatientSearch from '../components/patient/PatientSearch'
import logo from '../components/header/webcert_logo.png'
import WebcertHeaderUser from '../components/header/WebcertHeaderUser'
import WebcertHeaderUnit from '../components/header/WebcertHeaderUnit'
import SystemBanners from '../components/notification/SystemBanners'
import { AppHeader } from '@frontend/common'
import { useDispatch } from 'react-redux'
import { searchPatient } from '../store/patient/patientActions'

const CreateCertificatePage: React.FC = () => {
  const [patientId, setPatientId] = useState('')
  const dispatch = useDispatch()

  const onTextInputChange = (patientId: string) => {
    setPatientId(patientId)
  }

  const onSubmit = () => {
    dispatch(searchPatient(patientId))
  }

  return (
    <>
      <AppHeader
        logo={logo}
        alt={'Logo Webcert'}
        primaryItems={[<WebcertHeaderUser />, <WebcertHeaderUnit />]}
        secondaryItems={[]}
        banners={[<SystemBanners />]}
      />
      <PatientSearch patientId={patientId} onChange={onTextInputChange} onSubmit={onSubmit} />
    </>
  )
}
export default CreateCertificatePage
