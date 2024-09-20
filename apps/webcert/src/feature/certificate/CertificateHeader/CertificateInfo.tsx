import type React from 'react'
import styled from 'styled-components'
import type { CertificateMetadata } from '../../../types'
import PatientStatusNotifications from '../Notifications/PatientStatusNotifications'

const Wrapper = styled.section`
  flex-grow: 1;
`

const PersonIdWrapper = styled.div`
  display: flex;
`

interface Props {
  certificateMetadata: CertificateMetadata
}

const CertificateInfo: React.FC<Props> = ({ certificateMetadata }) => {
  return (
    <Wrapper>
      <h1 className="iu-fw-body iu-fs-600 iu-mt-200" style={{ whiteSpace: 'nowrap' }}>
        {certificateMetadata.name}
      </h1>
      <PersonIdWrapper>
        <h2 className="iu-mb-200 iu-fs-400 iu-color-sky-dark" style={{ whiteSpace: 'nowrap' }}>
          {certificateMetadata.patient.fullName} - {certificateMetadata.patient.personId.id}
        </h2>
        <p className={'iu-pl-300'}>
          {certificateMetadata.patient.previousPersonId && ' fd. ' + certificateMetadata.patient.previousPersonId.id}
        </p>
      </PersonIdWrapper>
      <PatientStatusNotifications />
    </Wrapper>
  )
}

export default CertificateInfo
