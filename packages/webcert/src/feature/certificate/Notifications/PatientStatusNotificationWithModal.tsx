import * as React from 'react'
import { InfoBox } from '@frontend/common'
import { TextWithInfoModal } from '@frontend/common/src'

interface Props {
  status: boolean
  title: string
  modalTitle: string
}

const PatientStatusNotificationWithModal: React.FC<Props> = ({ status, title, modalTitle, children }) => {
  if (!status) return null

  return (
    <InfoBox type={'info'}>
      <TextWithInfoModal text={title} modalTitle={modalTitle}>
        {children}
      </TextWithInfoModal>
    </InfoBox>
  )
}

export default PatientStatusNotificationWithModal
