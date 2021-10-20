import { CertificateMetadata } from '@frontend/common'
import React from 'react'
import styled from 'styled-components'
import PatientStatusNotifications from '../Notifications/PatientStatusNotifications'
import { PersonId } from '@frontend/common/src'
import { useSelector } from 'react-redux'
import { getPreviousPatientId } from '../../../store/certificate/certificateSelectors'

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
  const previousPatientId: PersonId | null = useSelector(getPreviousPatientId)
  return (
    <Wrapper>
      <h1 className="iu-fw-body iu-fs-600 iu-mt-200">{certificateMetadata.name}</h1>
      <PersonIdWrapper>
        <h2 className={`iu-mb-200 iu-fs-400 iu-color-sky-dark`}>
          {certificateMetadata.patient.fullName} - {certificateMetadata.patient.personId.id}
        </h2>
        <p className={'iu-pl-300'}>{previousPatientId && ' fd. ' + previousPatientId.id}</p>
      </PersonIdWrapper>
      <PatientStatusNotifications />
    </Wrapper>
  )
}

export default CertificateInfo
