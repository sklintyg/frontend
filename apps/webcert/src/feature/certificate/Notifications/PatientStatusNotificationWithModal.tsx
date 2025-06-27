import type { ReactNode } from 'react'
import styled from 'styled-components'
import InfoBox from '../../../components/utils/InfoBox'
import TextWithInfoModal from '../../../components/utils/Modal/TextWithInfoModal'

interface Props {
  status: boolean
  title: string
  modalTitle: string
  type: 'info' | 'error' | 'success' | 'observe' | 'protected_person' | 'deceased'
  children: ReactNode
}

const Wrapper = styled.div`
  width: fit-content;
  margin-right: 10px;
`

const PatientStatusNotificationWithModal = ({ status, title, modalTitle, type, children }: Props) => {
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
