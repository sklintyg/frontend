import * as React from 'react'
import { CertificateDataElement, ConfigUeMessage, InfoBox } from '@frontend/common'
import styled from 'styled-components'
import { MessageLevel } from '@frontend/common/src/types/certificate'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const Wrapper = styled.div`
  width: fit-content;
  margin-right: 10px;
  text-align: center;
`

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
    <Wrapper>
      <InfoBox type={messageLevelToInfoBoxLevel(questionConfig.level)}>
        <p>{questionConfig.message}</p>
      </InfoBox>
    </Wrapper>
  )
}

export default AlertMessage
