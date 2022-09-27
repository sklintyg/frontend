import {
  CertificateDataElement,
  CertificateDataValueType,
  Dropdown,
  ConfigTypes,
  ConfigureUeUncertainDate,
  QuestionValidationTexts,
  ValueCode,
} from '@frontend/common'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { updateCertificateDataElement, updateClientValidationError } from '../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
`

export interface Props {
  label?: string
  id: string
  hasValidationError?: boolean
  disabled?: boolean
  question: CertificateDataElement
}

const UeUncertainDate: React.FC<Props> = (props) => {
  const { label, id, question, hasValidationError, disabled } = props
  const config = question.config as ConfigureUeUncertainDate

  let years = config.allowerYears
  if (config.unknownYear) years.push('0000')
  years.sort()

  let months: string[] = []
  const firstMonth = config.unknownMonth ? 0 : 1
  for (let i = firstMonth; i <= 12; i++) {
    let strMonth = '00' + i.toString()
    months.push(strMonth.substring(strMonth.length - 2))
  }

  return <Wrapper></Wrapper>
}
