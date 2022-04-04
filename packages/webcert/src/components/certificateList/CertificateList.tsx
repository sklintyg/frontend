import React from 'react'
import styled from 'styled-components'
import CertificateListRow from './CertificateListRow'

const CreateCertificate: React.FC = () => {
  const CertificateBox = styled.div`
    max-width: 75%;
    max-height: 32em;
    overflow-y: auto;
  `

  return (
    <div className="ic-container iu-mt-gutter">
      <h2 className="iu-mb-05rem">Skapa intyg</h2>
      <CertificateBox className="iu-shadow-sm iu-flex iu-flex-column">
        <CertificateListRow />
        <CertificateListRow />
        <CertificateListRow />
        <CertificateListRow />
        <CertificateListRow />
        <CertificateListRow />
        <CertificateListRow />
      </CertificateBox>
    </div>
  )
}

export default CreateCertificate
