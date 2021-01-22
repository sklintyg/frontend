import * as React from 'react'
import { ValueBoolean, ValueCodeList, ValueCode, CertificateDataElement, ValueText } from '@frontend/common'
import { CertificateDataConfig, CertificateDataValueType } from '../../types/certificate'
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
  let displayText = 'Ej angivet'

  const getCodeListText = (id: string, config: CertificateDataConfig) => {
    const item = (config.list as ValueCode[]).find((item) => item.id === id)
    return '<li>' + item?.label + '</li>'
  }

  switch (question.value!.type) {
    case CertificateDataValueType.BOOLEAN:
      const booleanConfig = question.config
      const booleanValue = question.value as ValueBoolean
      if (booleanValue.selected !== null && question.visible) {
        displayText = booleanValue.selected ? (booleanConfig.selectedText as string) : (booleanConfig.unselectedText as string)
      }
      break
    case CertificateDataValueType.TEXT:
      const textValue = question.value as ValueText
      if (textValue.text != null && textValue.text.length > 0) {
        displayText = textValue.text
      }
      break
    case CertificateDataValueType.CODE_LIST:
      const codeListValue = question.value as ValueCodeList
      const codeListConfig = question.config
      if (codeListValue.list.length > 0 && question.visible) {
        displayText = ''
        const texts = (codeListValue.list as ValueCode[]).map((value) => getCodeListText(value.id, codeListConfig))
        texts.map((t) => (displayText += t))
      }
      break
    case CertificateDataValueType.CODE:
      const codeValue = question.value as ValueCode
      const codeConfig = question.config
      if (codeValue.id !== undefined && question.visible) {
        displayText = (codeConfig.list as ValueCode[]).find((item) => item.id === codeValue.id)?.label as string
      }
      break
    default:
      displayText = 'Okänd datatyp'
      break
  }

  return (
    <Root className={'iu-bg-grey-300 iu-radius-sm'}>
      <div className={'iu-fs-200'} dangerouslySetInnerHTML={{ __html: displayText }}></div>
    </Root>
  )
}

export default UvText
