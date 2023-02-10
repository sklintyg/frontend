import { CertificateDataElement, ConfigUeMessage, InfoBox, MessageLevel } from '@frontend/common'
import * as React from 'react'

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

const UeMessage: React.FC<Props> = ({ question }) => {
  const questionConfig = question.config as ConfigUeMessage

  return (
    <InfoBox type={messageLevelToInfoBoxLevel(questionConfig.level)}>
      <p>{questionConfig.message}</p>
    </InfoBox>
  )
}

export default UeMessage
