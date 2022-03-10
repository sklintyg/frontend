import React from 'react'
import PatientSearch from '../components/patient/PatientSearch'
import WebcertHeader from '../components/header/WebcertHeader'

const CreateCertificatePage: React.FC = () => {
  return (
    <>
      <WebcertHeader />
      <div className={'ic-container'}>
        <PatientSearch />
      </div>
    </>
  )
}
export default CreateCertificatePage
