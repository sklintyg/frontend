import { InfoBox, TextWithInfoModal } from '@frontend/common'
import * as React from 'react'
import styled from 'styled-components'

interface Props {
  status: boolean
  title: string
  modalTitle: string
  type: 'info' | 'error' | 'success' | 'observe' | 'protected_person' | 'deceased'
  children: React.ReactNode
}

const Wrapper = styled.div`
  width: fit-content;
  margin-right: 10px;
`

const PatientStatusNotificationWithModal: React.FC<Props> = ({ status, title, modalTitle, type, children }) => {
  if (!status) return null

  return (
    <Wrapper>
      <InfoBox type={type}>
        <TextWithInfoModal text={title} modalTitle={modalTitle}>
          {children}
        </TextWithInfoModal>
      </InfoBox>
    </Wrapper>
  )
}

export default PatientStatusNotificationWithModal
