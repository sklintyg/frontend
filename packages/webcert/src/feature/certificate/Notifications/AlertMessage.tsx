import * as React from 'react'
import { CertificateDataElement, ConfigUeMessage, InfoBox } from '@frontend/common'
import { MessageLevel } from '@frontend/common/src/types/certificate'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const messageLevelToInfoBoxLevel = (level: MessageLevel): 'info' | 'error' | 'observe' => {
  switch (level) {
    case MessageLevel.ERROR:
      return 'error'
    case MessageLevel.OBSERVE:
      return 'observe'
    default:
      return 'info'
  }
}

const AlertMessage: React.FC<Props> = ({ question }) => {
  const questionConfig = question.config as ConfigUeMessage

  return (
    <InfoBox type={messageLevelToInfoBoxLevel(questionConfig.level)}>
      <p>{questionConfig.message}</p>
    </InfoBox>
  )
}

export default AlertMessage
