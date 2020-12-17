import * as React from 'react'
import { ValueBoolean, CertificateDataElement, CertificateDataValueType, ValueText } from '@frontend/common'
import { ConfigUeRadioBoolean } from '../../types/certificate'
import styled from 'styled-components'

const Root = styled.div`
  white-space: pre-wrap;
  display: inline-block;
  padding: 8px 14px;
`

interface UvTextProps {
  question: CertificateDataElement
}

const UvText: React.FC<UvTextProps> = ({ question }) => {
  const questionConfig = question.config as ConfigUeRadioBoolean
  let displayText = 'Ej angivet'

  switch (question.value!.type) {
    case CertificateDataValueType.BOOLEAN:
      const booleanValue = question.value as ValueBoolean
      if (booleanValue.selected !== null && question.visible) {
        displayText = booleanValue.selected ? questionConfig.selectedText : questionConfig.unselectedText
      }
      break
    case CertificateDataValueType.TEXT:
      const textValue = question.value as ValueText
      if (textValue.text != null && textValue.text.length > 0) {
        displayText = textValue.text
      }
      break
    default:
      displayText = 'Okänd datatyp'
      break
  }

  return (
    <Root className={'iu-bg-grey-300 iu-radius-sm'}>
      <p className={'iu-fs-200'}>{displayText}</p>
    </Root>
  )
}

export default UvText
