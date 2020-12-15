import { CertificateMetadata } from '@frontend/common'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.section`
  flex-grow: 1;
`
interface Props {
  certificateMetadata: CertificateMetadata
}

const CertificateInfo: React.FC<Props> = ({ certificateMetadata }) => {
  return (
    <Wrapper>
      <h2 className="iu-fw-body iu-fs-600 iu-mt-200">{certificateMetadata.certificateName}</h2>
      <h3 className={`iu-mb-200 iu-fs-400 iu-color-sky-dark`}>
        {certificateMetadata.patient.fullName} - {certificateMetadata.patient.personId}
      </h3>
    </Wrapper>
  )
}

export default CertificateInfo
